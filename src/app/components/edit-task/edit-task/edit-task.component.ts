import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EditTaskRequest } from '../../../models/edit-task-request.model';
import { TaskItem } from '../../../models/task-item.model';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit{
  editTaskForm: FormGroup;
  taskId!: number;
  message: string | null = null;
  error: string | null = null;



  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.editTaskForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      assignedTo: ['', Validators.email],
      isCompleted: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  loadTask(): void {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: TaskItem) => {
        this.editTaskForm.patchValue({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? task.dueDate.toString().split('T')[0] : '',
          assignedTo: task.assignedTo,
          isCompleted: task.isCompleted
        });
      },
      error: (error) => {
        this.error = 'Failed to load task';
      }
    });
  }

  onSubmit(): void {
    if (this.editTaskForm.valid) {
      const editTaskRequest: EditTaskRequest = {
        id: this.taskId,
        title: this.editTaskForm.get('title')?.value,
        description: this.editTaskForm.get('description')?.value,
        dueDate: this.editTaskForm.get('dueDate')?.value,
        assignedTo: this.editTaskForm.get('assignedTo')?.value,
        isCompleted: this.editTaskForm.get('isCompleted')?.value
      };

      this.taskService.editTask(this.taskId, editTaskRequest).subscribe({
        next: (response) => {
          this.message = 'Task updated successfully';
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 2000);
        },
        error: (error) => {
          this.error = 'Failed to update task';
        }
      });
    }
  }
}