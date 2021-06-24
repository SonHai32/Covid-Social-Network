import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'home-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  @ViewChild('inputTag', { static: false }) inputTagRef?: ElementRef;
  @ViewChild('postContentInput', { static: false })
  postContentInputRef?: ElementRef;
  inputTagVisible: boolean = false;
  addTagLabelVisible: boolean = false;
  tags: string[] = [];
  inputTagValue: string = '';
  imageFiles: NzUploadFile[] = []
  imageListVisible: boolean = false;

  constructor(private msg: NzMessageService) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.postContentInputRef?.nativeElement.focus();
    }, 2000);
  }

  showInputTag() {
    this.inputTagVisible = true;

    setTimeout(() => {
      this.inputTagRef?.nativeElement.focus();
    }, 10);
  }

  submitTag(): void {
    if (
      this.inputTagValue &&
      this.tags.indexOf(this.inputTagValue) === -1 &&
      this.inputTagValid()
    ) {
      this.tags = [...this.tags, this.inputTagValue];
      this.affterTagSubmit();
    } else {
      this.affterTagSubmit();
    }
  }

  affterTagSubmit() {
    this.inputTagValue = '';
    this.inputTagVisible = false;
  }

  removeTag(removeTag: string) {
    this.tags = this.tags.filter((tag: string) => tag !== removeTag);

    setTimeout(() => {
      if (this.tags.length === 0) {
        this.addTagLabelVisible = false;
      }
    }, 10);
  }

  showTagLabel(): void {
    this.addTagLabelVisible = true;

    setTimeout(() => {
      if (this.tags.length === 0) {
        this.addTagLabelVisible = false;
      }
    }, 10000);
  }

  inputTagValid(): boolean {
    let isValid: boolean = true;
    if (this.inputTagValue.length > 15) {
      this.msg.error('Hashtag tối đa 15 kí tự');
      isValid = false;
    }

    return isValid;
  }


  beforeUpload = (file: NzUploadFile): boolean => {
    console.log(file)
    this.imageFiles = this.imageFiles.concat(file)
    return false;
  };


  toggleShowListImage(): void{
    this.imageListVisible = !this.imageListVisible
  }
}
