import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      dueDate: [''],
      isCompleted: [false],
      assignedTo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        dueDate: this.taskForm.get('dueDate')?.value 
          ? new Date(this.taskForm.get('dueDate')?.value).toISOString() 
          : null
      };

      this.taskService.addTask(taskData).subscribe({
        next: (response) => {
          this.router.navigate(['/tasks']);
          console.log('Task added successfully:', response);
          this.message = 'Task added successfully';
          this.error = null; // Clear any previous errors
        },
        error: (error) => {
          console.error('Error adding task:', error);
          this.message = null; // Clear any previous success messages
          this.error = 'Error adding task. Please try again.';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            this.error += ` Error: ${error.error.message}`;
          } else {
            // Server-side error
            this.error += ` Error Code: ${error.status}, Message: ${error.message}`;
          }
        }
      });
    } else {
      // Form is invalid
      this.error = 'Please fill in all required fields correctly.';
    }
  }
}
