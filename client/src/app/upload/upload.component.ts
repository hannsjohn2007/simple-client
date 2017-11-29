import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {saveAs} from 'file-saver/FileSaver';
import {LambdaClientService} from "../services/lambdaClientService";

const WS_SERVER = "https://mz20iyigvg.execute-api.eu-west-1.amazonaws.com/devmax/";
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  operations = ['encrypt', 'decrypt'];
  ngOnInit() {
  }

  constructor(private fb: FormBuilder,private http: HttpClient, private lambdaClientService: LambdaClientService) {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      algorithm: ['aes192', Validators.required],
      secretKey: ['hello there', Validators.required],
      operation: [this.operations[0], Validators.required],
      file: null
    });
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(this.form.get);
      this.form.get('file').setValue(file);
      console.log(this.form);
    }
  }

  async onSubmit() {
    const body = this.generatePayload();
    let res = await this.processFile(body);
    saveAs(res.blob,res.filename);
  }

  private async processFile(body: { file: any; operation: any; algorithm: any; secretKey: any }) {
    const operation = this.form.get('operation').value;
    let res;
    if (operation === 'encrypt') {
      res = await this.lambdaClientService.encrypt(body)
    } else {
      res = await this.lambdaClientService.decrypt(body);
      res.filename = this.getOriginalFilename();
    }
    return res;
  }

  private getOriginalFilename() {
    let newFilename = this.form.get('file').value.name.split('.');
    newFilename.pop();
    return newFilename.join('.');
  }

  private generatePayload() {
    return {
      file: this.form.get('file').value,
      operation: this.form.get('operation').value,
      algorithm: this.form.get('algorithm').value,
      secretKey: this.form.get('secretKey').value
    };
  }
}
