import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { TaskItem } from '../../../models/task-item.model';
import { TaskResponse } from '../../../models/task-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExportRequest } from '../../../models/export-request.model';

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
  pageSize: number = 3;
  searchQuery: string = '';
  prevPage: number | null = null;
  nextPage: number | null = null;
  totalPages: number [] = [];
  sortBy: string = 'title';
  sortDirection: string = 'asc';
  selectedIds: string[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks(this.searchQuery, this.sortBy, this.sortDirection, this.pageSize, this.pageNumber)
      .subscribe({
        next: (response: TaskResponse) => {
          this.tasks = response.taskItems || [];
          this.tasks = response.taskItems;
          this.totalPages = Array.from({ length: response.TotalPages }, (_, i) => i + 1);
          
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
    const request: ExportRequest = {
      searchQuery: this.searchQuery,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      selectedIds: this.selectedIds.map(id => parseInt(id, 10))
    };

    this.taskService.exportToExcel(request)
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'tasks.xlsx';
          a.click();
        },
        error: (error) => {
          this.error = 'Failed to export tasks to Excel';
        }
      });
  }
  
  searchTasks(): void {
    this.pageNumber = 1; 
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
    this.selectedIds = this.tasks
      .filter((task) => task.isSelected)
      .map((task) => task.id.toString());
  }

  editTask(taskId: number): void {
    this.message = `Edit task with ID: ${taskId}`;
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId)
      .subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          this.message = `Deleted task with ID: ${taskId}`;
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.error = 'Failed to delete task';
        }
      });
  }

  onPageChange(pageNumber: number): void {
    console.log('Page change requested:', pageNumber);
    if (pageNumber >= 1 && pageNumber <= this.totalPages.length) {
      this.pageNumber = pageNumber;
      this.loadTasks();
      console.log('Page number updated:', this.pageNumber);
    }
  }

  closeAlert(): void {
    this.message = null;
    this.error = null;
  }
}