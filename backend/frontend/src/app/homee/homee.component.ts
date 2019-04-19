import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import {FileuploadService} from '../fileupload.service';
import {saveas} from 'file-saver';
import { mongoService } from '../mongo.service';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const uri = 'http://localhost:3000/file/upload';

@Component({
  selector: 'app-homee',
  templateUrl: './homee.component.html',
  styleUrls: ['./homee.component.css']
})
export class HomeeComponent implements OnInit {
public projecttitle: any;
  form1: FormGroup;
  uploader: FileUploader = new FileUploader({url: uri});
  attachmentList: any = [];

  constructor(private _fileService: FileuploadService, public formDetails: mongoService, public route: ActivatedRoute) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(this.uploader);
      console.log(item);
      console.log(response);
      this.attachmentList.push(JSON.parse(response));
    };
  }

  download(index){
    var filename = this.attachmentList[index].uploadname;

    this._fileService.downloadFile(filename)
      .subscribe(
        data => saveas(data, filename),
        error => console.error(error)
      );
  }

  ngOnInit() {
    this.form1 = new FormGroup(
      {
        User: new FormControl(),
        Projecttitle : new FormControl(),
        ProjectDescription : new FormControl(),
        GithubURL : new FormControl()
      });
  }
  onSubmit1() {
    console.log(this.form1.value),
      this.form1.value.User = this.route.snapshot.paramMap.get('id');
    this.formDetails.sendDetails(this.form1.value).subscribe(result => {
      console.log('login check point result - ', result);
      /*this.formDetails.sendfilename(result.uploadname).subscribe( details => {
        console.log(details);});*/
    });
  }
}



