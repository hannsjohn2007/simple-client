import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {saveAs} from 'file-saver/FileSaver';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  ngOnInit() {
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.createForm();
  }
  operations = ['encrypt', 'decrypt'];
  createForm() {
    this.form = this.fb.group({
      algorithm: ['aes192', Validators.required],
      secketKey: ['hello there', Validators.required],
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

  private prepareSave(): any {
    let input = new FormData();
    input.append('secretKey', 'hello there');
    input.append('algorithm', 'aes192');
    // input.append('algorithm', this.form.get('name').value);
    input.append('file', this.form.get('file').value, );
    return input;
  }

  onSubmit() {
    const formModel = this.prepareSave();
    const operation = this.form.get('operation').value;
    this.http.post(`http://localhost:3000/api/${operation}`, formModel,{responseType: "blob"})
      .subscribe(res => {
        let fileBlob = res;
        let filename = '';
        if(operation === "encrypt") {
          filename = `${this.form.get('file').value.name}.encrypt`;
        }
        else {
          let split = this.form.get('file').value.name.split('.');
          split.pop();
          filename = split.join('.');
        }
        saveAs(fileBlob,filename);
        console.log(this.form.get('file').value);
      })
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
