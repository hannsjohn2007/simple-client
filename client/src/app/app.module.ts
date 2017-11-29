import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LambdaClientService} from "./services/lambdaClientService";
@NgModule({
  declarations: [
    AppComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [LambdaClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
