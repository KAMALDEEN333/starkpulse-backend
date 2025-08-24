import { Injectable, Logger } from '@nestjs/common';
import { KeyManagementService } from './key-management.service';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);

  constructor(private readonly keyManagementService: KeyManagementService) {}

  // Encrypts a string using the current key and IV from KeyManagementService
  encrypt(text: string): string {
    try {
      const key = this.keyManagementService.getCurrentKey();
      const iv = this.keyManagementService.getCurrentIv();
      const algorithm = this.keyManagementService.getAlgorithm();

      const cipher = createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      let authTag: Buffer | null = null;
      if (algorithm.toLowerCase().includes('gcm') && 'getAuthTag' in cipher) {
        authTag = (cipher as any).getAuthTag();
      }

      return `${iv.toString('hex')}:${encrypted}:${authTag ? authTag.toString('hex') : ''}`;
    } catch (error) {
      this.logger.error(`Encryption failed: ${error.message}`, error.stack);
      throw new Error('Failed to encrypt data.');
    }
  }

  // Decrypts an encrypted string
  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format.');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const authTagHex = parts[2];
      const authTag = authTagHex ? Buffer.from(authTagHex, 'hex') : null;

      const key = this.keyManagementService.getCurrentKey();
      const algorithm = this.keyManagementService.getAlgorithm();

      const decipher = createDecipheriv(algorithm, key, iv);
      if (algorithm.toLowerCase().includes('gcm') && authTag) {
        (decipher as any).setAuthTag(authTag);
      }

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error(`Decryption failed: ${error.message}`, error.stack);
      throw new Error('Failed to decrypt data. Key mismatch or corrupted data.');
    }
  }

  async encryptFileContent(content: string): Promise<string> {
    this.logger.log('Simulating file content encryption...');
    return this.encrypt(content);
  }

  async decryptFileContent(encryptedContent: string): Promise<string> {
    this.logger.log('Simulating file content decryption...');
    return this.decrypt(encryptedContent);
  }
}
