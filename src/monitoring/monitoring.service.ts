/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';

@Injectable()
export class MonitoringService {
  logUsage(user: any, url: string, method: string, duration: number) {
    throw new Error("Method not implemented.");
  }
  logUsage(user: any, url: string, method: string, duration: number) {
    throw new Error("Method not implemented.");
  }
  getMetrics: any;
  create(createMonitoringDto: CreateMonitoringDto) {
    return 'This action adds a new monitoring';
  }

  findAll() {
    return `This action returns all monitoring`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitoring`;
  }

  update(id: number, updateMonitoringDto: UpdateMonitoringDto) {
    return `This action updates a #${id} monitoring`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitoring`;
  }
}
