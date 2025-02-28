import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';

export interface AppResponse {
    status: boolean;
    message: string;
    data: object | null;
}

@Injectable()
export class BaseServiceService {

    encrypt = (plainText: any) => {
        const secretKey = 'bvgbackend2025AES123456789@12345';
        const iv = Buffer.alloc(16);
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    };

    decrypt = (cipherText: string) => {
        const secretKey = 'bvgbackend2025AES123456789@12345';
        const iv = Buffer.alloc(16);
        const buffer = Buffer.from(cipherText, 'base64');
        const aes = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
        try {
            let decrypted = aes.update(buffer);
            decrypted = Buffer.concat([decrypted, aes.final()]);
            return JSON.parse(decrypted.toString('utf8'));
        } catch (error) {
            throw new Error('Decryption failed');
        }
    };

    success(message: string = 'Success', data: object = null) {
        const body = this.encrypt(JSON.stringify({
            status: true,
            message: message,
            data: data,
        }));
        return { body };
    }

    error(message: string = 'Something went wrong!',data: object = null) {
        const body = this.encrypt(JSON.stringify({
            status: false,
            message: message,
            data: data,
        }));
        return { body };
    }
}
