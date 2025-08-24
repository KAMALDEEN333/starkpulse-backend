import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PortfolioSnapshot } from '../../portfolio/entities/portfolio.entity';
import { PortfolioAsset } from '../../portfolio/entities/portfolio-asset.entity';

@Entity('users')
export class User {
  // GDPR/Privacy fields
  @Column({ default: false })
  dataErasureRequested: boolean;

  @Column({ type: 'json', nullable: true })
  consent: Record<string, boolean>;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDeletionAt?: Date;
  // Data export request timestamp
  @Column({ type: 'timestamp', nullable: true })
  lastDataExportRequestedAt?: Date;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  roles: string;

  @Column({ type: 'enum', enum: ['free', 'pro', 'enterprise'], default: 'free' })
  tier: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  refreshToken?: string | null;

  @OneToMany(() => PortfolioAsset, (asset) => asset.user)
  portfolioAssets: PortfolioAsset[];

  @Column({ unique: true, nullable: true })
  walletAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PortfolioSnapshot, (snapshot) => snapshot.user)
  snapshots: PortfolioSnapshot[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Helper method to safely get wallet address or throw an error
  getWalletAddress(): string {
    if (!this.walletAddress) {
      throw new Error('User does not have a connected wallet');
    }
    return this.walletAddress;
  }
}
