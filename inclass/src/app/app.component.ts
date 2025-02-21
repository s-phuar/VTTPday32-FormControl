import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{


  //MAPPING FORMS IN JAVASCRIPT

  //autowiring with inject(1st version newer)
  private fb = inject(FormBuilder)

  //typescript constructor to inject (2nd version older)
    // constructor(private fb: FormBuilder){
    //   console.info('in constructor')
    //   this.fb = fb
    // }

  //initialise 'form' of type FormGroup to hold form data
  protected form!: FormGroup
    //bind above model to html form in html([formGroup]="form")

  //initialise 'activities' of type FormArray to hold array of form controls(list of activities)
  protected activities!: FormArray

  //stores name of task control
  protected taskControlName = 'taskName'

  //class constructor for component that is called before ngOnHInit, constructor injection
  constructor() {console.info('in constructor: ')}

  //called once constructor is initialised
  ngOnInit(): void{
    console.info('>>> in ngOnInit')
    this.form = this.createForm()
  }


  //push form group into acitvities array
  protected addActivity(){
    this.activities.push(this.createActivity())
  }
  //delete from activities array
  protected deleteActivity(idx: number){
    console.info('>>> idx: ', idx)
    this.activities.removeAt(idx)
  }


  protected invalid(): boolean{
    // !!this.form?.invalid 
    return this.form.invalid || this.activities.controls.length <= 0
  }


  //this.form refers to the formgroup instace (collection of form controls)
  //.get accesss the specific form control in the group
  protected isCtrlInvalid(ctrlName: string): boolean{
    return !!this.form.get(ctrlName)?.invalid
  }


  //a method to process to form when submitted
  protected processForm(): void{
    //grab value and map into a Task object, allows us the process and pass it around
    //manual creation
      // const values2: Task = {
      //   taskName: this.form.controls['taskName'].value,
      //   dueDate: this.form.controls['dueDate'].value,
      //   priority: this.form.controls['priority'].value,
      //   activities: this.forn.controls['activities'].value
      // }

    const values: Task = this.form.value
    console.info('>>>values: ', values)
    // this.form.reset()
  }


  //creates a form group with 1 control (activityName)
  private createActivity(): FormGroup{
    return this.fb.group({
      activityName: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })

  }





  //method to create form, initialised with ngOnInit
  private createForm(): FormGroup{
    this.activities = this.fb.array([], [Validators.minLength(1)])
    return this.fb.group({
      taskName: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      dueDate: this.fb.control<string>('', [Validators.required]),
      priority: this.fb.control<string>('med'),
      activities: this.activities  //grabs activities array from above
    })

  }

  





}
