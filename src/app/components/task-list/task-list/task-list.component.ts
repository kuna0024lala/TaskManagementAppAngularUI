// src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { TaskItem } from '../../../models/task-item.model';
import { TaskResponse } from '../../../models/task-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  message: string | null = null;
  error: string | null = null;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  prevPage: number | null = null;
  nextPage: number | null = null;
  totalPages: number[] = [];
  sortBy: string = 'title';
  sortDirection: string = 'asc';
  selectedIds: string[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadTasks();
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.taskService.getTasks(this.searchQuery, this.sortBy, this.sortDirection, this.pageSize, this.pageNumber)
      .subscribe({
        next: (response: TaskResponse) => {
          this.tasks = response.TaskItems || [];
          console.log('API Response:', response); // Debug API response
          this.tasks = response.TaskItems;
          console.log('Tasks:', this.tasks); // Debug tasks
          this.totalPages = Array.from({ length: response.TotalPages }, (_, i) => i + 1);
          this.prevPage = this.pageNumber > 1 ? this.pageNumber - 1 : null;
          this.nextPage = this.pageNumber < response.TotalPages ? this.pageNumber + 1 : null;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.error = 'Failed to load tasks';
        }
      });
  }
  
  

  addTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  exportToExcel(): void {
    this.message = 'Tasks exported to Excel successfully.';
  }

  searchTasks(): void {
    this.pageNumber = 1; // Reset to first page on search
    this.loadTasks();
  }

  sortTasks(sortBy: string, sortDirection: string): void {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
    this.loadTasks();
  }

  toggleAllSelection(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tasks.forEach(task => task.isSelected = checked);
    this.updateSelectedIds();
  }

  updateSelectedIds(): void {
    this.selectedIds = this.tasks.filter(task => task.isSelected).map(task => task.id.toString());
  }

  editTask(taskId: number): void {
    this.message = `Edit task with ID: ${taskId}`;
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.message = `Deleted task with ID: ${taskId}`;
      },
      error: (error) => {
        this.error = 'Failed to delete task';
        console.error(error);
      }
    });
  }

  changePage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages.length) {
      this.pageNumber = pageNumber;
      this.loadTasks();
    }
  }

  closeAlert(): void {
    this.message = null;
    this.error = null;
  }
}