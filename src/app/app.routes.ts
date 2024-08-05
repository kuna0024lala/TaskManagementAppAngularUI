import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './components/add-task/add-task/add-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task/edit-task.component';
import { TaskListComponent } from './components/task-list/task-list/task-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

imports:[
  BrowserModule,
  provideHttpClient(),
  FormsModule,
  CommonModule,
  RouterModule,
  ReactiveFormsModule,

]
export const routes: Routes = [
   {
    path:'tasks/add',
    component: AddTaskComponent
 },
 {
  path:'',
  redirectTo:'/tasks',
  pathMatch:'full'

 },
 {
   path:'tasks',
   component: TaskListComponent
 },
 {
   path:'tasks/edit/:id',
   component: EditTaskComponent
 }
];
