import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { indiTask } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  //differentiate between control name and variable name

  private fb = inject(FormBuilder)
  protected baseForm !: FormGroup
  protected taskList !: FormArray

  //class constructor for component that is called before ngOnHInit, constructor injection
  constructor() {console.info('in constructor: ')}

  ngOnInit(): void {
    //create empty form on start
    this.baseForm = this.createForm()

    //load tasklist from local storage -> DevTools/application
    const savedTaskList = localStorage.getItem('taskList');
    //truthy check
    if (savedTaskList) {
      // Parse the data and populate the task list
      const parsedTasks = JSON.parse(savedTaskList);
  
      // for each loop, create a formgroup and push into task list
      parsedTasks.forEach((task: any) => {
        this.taskList.push(this.fb.group({
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate
        }));
      });
    }
  }

  

  //empty base form and array
  private createForm(): FormGroup{
    this.taskList = this.fb.array([])
    return this.fb.group({
      description: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      priority: this.fb.control<string>('low'),
      dueDate: this.fb.control<string>('2025-02-21', [Validators.required]), //no built in validator for date checking
      // FormArray needs to be part of FormGroup due to [formGroup]="baseForm"
          //set empty taskList into formgroup
      taskList: this.taskList
    })
  }


  //add task to taskList on button press
  protected addTask(){
    this.taskList.push(this.processForm())
    console.info('current task list: ', this.taskList)
    // this.baseForm.reset()

    //saving to localstorage
    this.saveToLocalStorage()
  }

  private saveToLocalStorage() {
    // Convert the task list to a plain array and serialize it
    const taskArray = this.taskList.getRawValue(); // this will return a plain JS object
    localStorage.setItem('taskList', JSON.stringify(taskArray)); // save to localStorage
  }
  

  protected deleteTask(idx: number){
    console.info('>>> idx: ', idx)
    this.taskList.removeAt(idx)
  }

  //set priority to complete
  protected completeTask(idx: number, newPriority: string){
    this.taskList.at(idx).get('priority')?.setValue('complete')
    console.info(`Updated priority of task ${idx} to ${newPriority}`);
  }


  //return filled input to taskList
  protected processForm(): FormGroup{

    // return the current state of the input form controls
    return this.fb.group({
      description: this.baseForm.controls['description'].value,
      priority: this.baseForm.controls['priority'].value,
      dueDate: this.baseForm.controls['dueDate'].value
    })
  }



  //form is considered invalid if there are no tasks or the form itself is invalid due to additional validations
  protected isInvalid(): boolean{
    return this.baseForm.invalid //.controls accesses the items in the form array
  }

  //check validation of individual form controls, ?. deals if possible null while !! turns it to proper bool
  protected isCtrlInvalid(ctrlName: string): boolean{
    return !!this.baseForm.get(ctrlName)?.invalid
  }


}
