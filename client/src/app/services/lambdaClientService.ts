import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {v4 as uuid} from 'uuid'
const WS_SERVER = "https://mz20iyigvg.execute-api.eu-west-1.amazonaws.com/devmax/";
const bucket = 'dev-simple-bucket';
const BUCKET_URL = 'bucketurl';
const ENCRYPT = 'encrypt';
const DECRYPT = 'decrypt';

@Injectable()
export class LambdaClientService {
  constructor(private http: HttpClient) { }

  private generateNewUuid(){
    return uuid();
  }
  async getSignedUrl(s3Option: any, operation: 'getObject' | 'putObject' | 'deleteObject') {
    s3Option.operation = operation;
    return this.http.post(`${WS_SERVER}${BUCKET_URL}`, s3Option)
      .toPromise().then((res: {url: string})=> res.url);
  }

  async encrypt(body: any){
    return this.process(body,ENCRYPT)
  }
  async decrypt(body: any){
    return this.process(body, DECRYPT);
  }

  private async process(body: any, operation: 'encrypt' | 'decrypt'){
    const uniqueFilename = `${this.generateNewUuid()}.${body.file.name.split('.').pop()}`;
    const fileBlob = new Blob([body.file]);
    const s3Reference = {
      Bucket: bucket,
      key: uniqueFilename
    };
    const lambdaPayload = {
      algorithm: body.algorithm,
      secretKey: body.secretKey,
      s3Reference: s3Reference
    };
    await this.uploadFileForProcessing(s3Reference, fileBlob);
    const cryptedFileInfo = await this.http.post(`${WS_SERVER}${operation}`, lambdaPayload,
      {responseType: 'json'}).toPromise();
    return await this.getObjectBlob(cryptedFileInfo);
  }

  private async uploadFileForProcessing(s3Ref: { Bucket: string; key: string }, fileBlob: Blob) {
    const uploadSignedUrl = await this.getSignedUrl(s3Ref, 'putObject');
    return await this.http.put(uploadSignedUrl, fileBlob, {responseType: "text"}).toPromise();
  }

  private async getObjectBlob(cryptedFileInfo: any) {
    const getObjectSignedUrl = await this.getSignedUrl(cryptedFileInfo, 'getObject');
    return await this.http.get(getObjectSignedUrl, {responseType: 'blob'})
      .toPromise()
      .then(async blob => {
        await this.cleanBucket(cryptedFileInfo);
        return {
          filename: cryptedFileInfo.key,
          blob: blob
        };
      });
  }

  private async cleanBucket(cryptedS3Ref: any) {
    const deleteSignedUrl = await this.getSignedUrl(cryptedS3Ref, 'deleteObject');
    return await this.http.delete(deleteSignedUrl).toPromise();
  }
}
