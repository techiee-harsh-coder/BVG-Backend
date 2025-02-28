import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import * as path from "path";

export async function ensurePathExists(directory: string): Promise<void> {
  if (!(existsSync(directory))) {
    mkdirSync(directory, { recursive: true });
  }
}
export async function uploadSingleFile(file: Express.Multer.File, uploadPath: string): Promise<string> {
  try {
    await ensurePathExists(uploadPath);
    const filePath = path.join(uploadPath, (Date.now()) + file.originalname);
    writeFileSync(filePath, file.buffer);
    return filePath;
  } catch (error) {
    console.log(error);
  }
}
export async function uploadMultipleFiles(files: Express.Multer.File[], uploadPath: string): Promise<string[]> {
  try {
    await ensurePathExists(uploadPath);
    const uploadedFilePaths = await Promise.all(files.map(async (file) => {
      return uploadSingleFile(file, uploadPath);
    }));
    return uploadedFilePaths;
  } catch (error) {
    console.log('Failed to upload multiple files');
  }
}
export async function updateSingleFile(file: Express.Multer.File, oldFilePath: string, uploadPath: string): Promise<string> {
  try {
    try {
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
      }
    } catch (e) { }
    return await uploadSingleFile(file, uploadPath);
  } catch (error) {
    console.log('Failed to update file');
  }
}
export async function updateMultipleFiles(files: Express.Multer.File[], oldFilePaths: string[], uploadPath: string): Promise<string[]> {
  try {
    await Promise.all(oldFilePaths.map(async (filePath) => {
      try{
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }catch(e){}
    }));
    return await uploadMultipleFiles(files, uploadPath);
  } catch (error) {
    console.log('Failed to update multiple files');
  }
}
export async function deleteSingleFile(filePath: string): Promise<void> {
  try {
    if (await existsSync(filePath)) {
      await unlinkSync(filePath);
    }
  } catch (error) {
    console.log('Failed to delete file');
  }
}
export async function deleteMultipleFiles(filePaths: string[]): Promise<void> {
  try {
    await Promise.all(filePaths.map(async (filePath) => {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }));
  } catch (error) {
    console.log('Failed to delete multiple files');
  }
}