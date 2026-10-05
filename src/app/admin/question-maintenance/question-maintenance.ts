import { Component, computed, effect, ElementRef, forwardRef, inject, OnInit, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { MainSubject } from '../../models/mainsubject';
import { MainSubjectService } from '../../services/mainsubject.service';
import { Question } from '../../models/question';
import { Title } from '../../models/title';
import { TitleService } from '../../services/title.service';
import { ModuleRegistry, AllCommunityModule, ColDef, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { QuestionService } from '../../services/question.service';
import { CorrectAnswers } from '../../models/correctAnswers';
import { CommonModule } from '@angular/common';
import { NEW_QUESTION, UPDATE_QUESTION } from '../../app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-question-maintenance',
  imports: [
    FormsModule,
    AgGridAngular,
    CommonModule
  
   // AllCommunityModule, //.withComponents(null),
  ],
  providers: [BsModalService]
,  templateUrl: './question-maintenance.html',
  styleUrl: './question-maintenance.css'
})
export class QuestionMaintenance implements OnInit {
  
    public modalRef?: BsModalRef;

 // constructor(private mainSubSvc: MainSubjectService) {}
  mainSubSvc = inject(MainSubjectService);
  titleSvc = inject(TitleService);
  questionSvc = inject(QuestionService);
  modalService = inject(BsModalService);
  imgsvc = inject(ImagesService);

    // Data for ag-grid
    public paginationPageSize = 10;
    @ViewChild('agGrid') agGrid?: AgGridAngular;
    private gridApi?: GridApi;

    newQid: any;
    newTitle: Title = { titleID: 0, mainSubjectId: 0, description: '' };
    selectedDomain: number = 1;  // hard-code since this is the only one supported for now.

    // Setting to type any to fix this error:
    //   TS2322: Type '({ headerName: string; field: string; sortable: boolean; sort: string; filter: boolean; checkboxSelection: boolean; } | 
    //   { headerName: string; field: string; sortable: boolean; sort: string; filter: boolean; })[]' is not assignable to type 'ColDef<Question, any>'.
    //   Types of property 'sort' are incompatible.
    columnDefs: any = [
      {headerName: 'Question ID', field: 'questionID', sortable: false, sort: 'asc', filter: true},
      {headerName: 'Title', field: 'titleDescription', sortable: true, filter: true},
      {headerName: 'Question Text', field: 'questionText', sortable: true, sort: 'asc', filter: true},
      {headerName: 'Answer', field: 'displayAnswer', sortable: true, sort: 'asc', filter: true}
    ];

 /*  gridOptions = {
    rowSelection: 'single'
    }; */

    //rowData?: any[];

    // variables for image upload
    @ViewChild('fileInput') fileInput!: ElementRef;
    fileDataUri : any;
    errorMsg = '';
    fileName:string = '';

      acceptedMimeTypes = [
        'image/gif',
        'image/jpeg',
        'image/png'
  ];

  ngOnInit() {
      
      ModuleRegistry.registerModules([ AllCommunityModule ])
      this.paginationPageSize = 10;
  }

   /* ngAfterViewInit() {
        this.gridApi = this.agGrid?.api;
      } */

 // this.mainSubSvc.GetAll();

  onSubmit() {
    console.log("onSubmit!! ", this.newQuestion, " question mode: ", this.questionModeSignal());
    console.log("      selectedMainSubject ", this.selectedMainSubject());

    if (this.questionModeSignal() == NEW_QUESTION) {
      this.questionSvc.postQuestion(this.newQuestion)
        .subscribe( (data: any) => {
       //   this.newQuestion.questionID = data['questionId'];
          this.newQid = data['questionId'];
          console.log("New question Id is " + this.newQid);
          this.newQuestion = this.clearedQuestion();
        },
      (error: HttpErrorResponse) => { console.log("POST failed!!", error); })
    }

    if (this.questionModeSignal() == UPDATE_QUESTION) {
      this.questionSvc.putQuestion(this.newQuestion, this.newQuestion.questionID as string)
        .subscribe( (data: any) => {
       //   this.newQuestion.questionID = data['questionId'];
        //  this.newQid = data['questionId'];
          console.log("Data from PUT: " + data);
          this.newQuestion = this.clearedQuestion();
        })
    }
  }

  questionModeSignal = signal(NEW_QUESTION);
  selectedMainSubject = this.mainSubSvc.selectedMainSubject;
  selectedTitle = signal<Title | undefined>(undefined);  //tmp - set to resource
  //selectedTitle = signal<string | undefined>(undefined);
  //selectedTitleObj: Title | undefined = undefined;  // TODO: Remove this!!

  hasImage?: boolean;
  isActive: boolean = true;
  skipUpload?: boolean;

  getSelectedRows() {
    const selectedNodes = this.agGrid?.api.getSelectedRows();
    console.log("In getSelectedRows() - ", this.agGrid ? this.agGrid : 'null', selectedNodes);
    
    const selectedData = selectedNodes?.map( node => node )
      .map(node => {
        this.newQuestion = node;
        // Get selected MainSubject from its ID. Use MS service?

        // Hack to ensure that titles is loaded
  //      let titlesTmp = this.titles();
  
        this.subjects = this.mainSubSvc.mainSubjectsResource.value;
        let subject = this.subjects().find(i => i.mainSubjectId === this.newQuestion.mainSubjectID);
        console.log("   looking for subject with id = ", this.newQuestion.mainSubjectID, " it is ", subject);
         this.selectedMainSubject.set(subject);
         // 20251025 Delete since titles already retrieved at page load
        // this.titles = this.titleSvc.titlesResource.value;
        // console.log("   titles returned: ", this.titles());
        let title = this.titlesByMS().find(i => i.titleID === this.newQuestion.titleID);

 //       console.log("Temp titles is ", titlesTmp);
 //       let title = titlesTmp.find(i => i.titleID === this.newQuestion.titleID);

        console.log("   looking for title with id = ", this.newQuestion.titleID, " it is ", title);
     //   this.selectedTitle.set(title);    //tmp remove 20251029
        console.log("In getSelectedRows() - subjects = ", this.subjects(), " titles = ", this.titles());
   } );
      
  //    .map(node => this.newQuestion = node);

     console.log(" --- ", this.newQuestion); 
  }

   /* onRowSelected(event: any) {
    console.log('Selected Row:', event.node.data);
 } */

  // url for titles:
  //     https://localhost:7073/api/Titles?MainSubjectId=8

  newQuestion: Question = this.clearedQuestion();

  clearedQuestion() : Question {
    const q: Question =
      {
      questionID: null,
      questionText: '',
      displayAnswer: '',
      titleID: 0,
      titleDescription: '',
      hasImage: false,
      imagePath: '',
      reference: '',
      correctAnswers: [],
      isActive: true,
      difficultyLevel: 0,  //was undefined
      mainSubjectID: 0,
      domainId: 1
      }
      return q;
}

  subjects = this.mainSubSvc.mainSubjectsResource.value;
  titles = this.titleSvc.titlesResource.value;
  titlesEffect = effect(()=> console.log('titles: ', this.titles()));
  titlesByMS = computed( () => this.titles().filter(i => i.mainSubjectId === this.selectedMainSubject()?.mainSubjectId))
  selectedTitleTmp : Title | undefined = undefined;
  myEffect = effect(() => {
      this.selectedTitleTmp = this.titlesByMS().find(i => i.titleID === this.newQuestion.titleID)
  });
  
  correctAnswer: CorrectAnswers = {correctAnswerId: 0, answerText: '', isRegex: false};  // correctAnswerId was
  //correctAnswers(): CorrectAnswers[] { return this!.newQuestion?.correctAnswers as CorrectAnswers[]; }

  addCorrectAnswer() {
    // changed to set correctAnswerId = 0 for new answers. EF will handle on backend.
    this.newQuestion.correctAnswers.push({ correctAnswerId: 0, answerText: '', isRegex: false });
  }

  rowData = this.questionSvc.questionsResource.value;

 /*  setTitle(titleSig: any) {
    console.log("Selected title: " + titleSig().value);
    this.newQuestion.titleId = titleSig().value.titleId;
  } */

 setTitle(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log("Target is " + target.value);
    
  //  this.selectedTitle.set(target.value);
  //  console.log("Selected title: " + this.selectedTitleObj?.titleId);
  //  this.newQuestion.titleId = Number(this.selectedTitleObj?.titleId);
    console.log("selected title temp is ", this.selectedTitleTmp);
  //  console.log("Selected title: " + this.selectedTitle()?.titleID);
    this.newQuestion.titleID = Number(this.selectedTitleTmp?.titleID);
 }

 onNewUpdateChange() {
  // Clear regardless of whether new or update selected.
  this.newQuestion = this.clearedQuestion();
  this.questionSvc.questionsResource.reload();
 }

 saveTitle() {
    console.log("saveTitle clicked!! title desc = "+ this.newTitle?.description);
    this.titleSvc.addTitle(this.selectedDomain, this.newTitle)
        .subscribe( (data: any) => {
          console.log("Data returned from title creation is: ", data);
          this.newQuestion.titleID = data['titleID'];
          console.log("New titleId is " + this.newQuestion.titleID);
          this.titleSvc.titlesResource.reload();
          this.titles = this.titleSvc.titlesResource.value;
        })
      }
  //  .subscribe((data: any) => {
  //    this.newQuestion.titleID = data['titleId'];
  //    console.log("New titleId is " + this.newQuestion.titleID);  
  //  },
  //  err => {},
  //  () => {
  //    this.titles = this.titleSvc.titlesResource.value;
   //   this.titleSvc.getTitles(this.selectedDomain)
   //   .subscribe(titles => this.titles = titles);
    

    /*
        .subscribe( (data: any) => {
          this.newQid = data['questionId'];
          console.log("New question Id is " + this.newQid);
        })
    */
//)
 // }

    public onMSChange() {
      // 20251025 remove this since titles retrieved at page load for all titles
   //   this.titles = this.titleSvc.titlesResource.value;
      let title = this.titles().find(i => i.titleID === this.newQuestion.titleID);
      console.log("In onMSChange(): looking for title with id = ", this.newQuestion.titleID, " it is ", title);
      this.selectedTitle.set(title);
      this.selectedMainSubject = this.mainSubSvc.selectedMainSubject;
      console.log("In onMSChange(): selected mainsubject is ", this.selectedMainSubject());
      this.newQuestion.mainSubjectID = this.selectedMainSubject()?.mainSubjectId; 
    }

    public openModal(template: TemplateRef<any>) {
      // Instantiate a new Title object and set the domainId.
    //  this.newTitle = new Title();
    //  this.newTitle.domainId = this.selectedDomain;
      this.newTitle = { titleID: 0, mainSubjectId: 0, description: '' };
      if (typeof this.selectedMainSubject()?.mainSubjectId === 'number') {
        let tmpMSID = this.selectedMainSubject()?.mainSubjectId ?? 0;
        this.newTitle.mainSubjectId = tmpMSID;
      }
      this.modalRef = this.modalService.show(template); 
  }

    public closeModal() {
      if (this.modalRef) {
        this.modalRef.hide();
      }
      }
  
    // For image upload
    previewFile() {
      const file = this.fileInput.nativeElement.files[0];
      if (file && this.validateFile(file)) {

        const reader = new FileReader();
        reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
        reader.onload = () => {
          this.fileDataUri = reader.result;
          console.log("Full file name is " + this.fileInput.nativeElement.value);
        // this.fileName = this.fileInput.nativeElement.value;
          this.fileName = this.fileInput.nativeElement.value.split('\\').pop().split('/').pop();
          console.log("Short file name is " + this.fileName);
        }
      } else {
        this.errorMsg = 'File must be jpg, png, or gif and cannot be exceed 500 KB in size'
      }
    }

    validateFile(file: any) {
      return this.acceptedMimeTypes.includes(file.type) && file.size < 500000;
    }

    uploadFile() {
    //  event.preventDefault();

      // get only the base64 file and post it
      if (this.fileDataUri.length > 0) {
        const base64File = this.fileDataUri.split(',')[1];
        // const data = {'image': base64File, 'fullFileName' : `science/`+this.fileName};
        // console.log(`${environment.apiUrl}/upload-image`)
      // this.http.post(`${environment.apiUrl}/upload-image`, data)
      console.log("In uploadFile() saving " + this.newQuestion.imagePath);
        
        this.imgsvc.addImage(this.newQuestion.imagePath, base64File)
          .subscribe(
            res => {
              // handle success
              // reset file input
              this.fileInput.nativeElement.value = '';
            },
            err => {
              this.errorMsg = 'Could not upload image.';
            }
          );
      }

    }      
      //end copy
}
