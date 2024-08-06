import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaskItem } from '../models/task-item.model';
import { AddTaskRequest } from '../models/add-task-request.model';
import { EditTaskRequest } from '../models/edit-task-request.model';
import { ExportRequest } from '../models/export-request.model';
import { TaskResponse } from '../models/task-response.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7150/api/tasks'; 

  constructor(private http: HttpClient) { }


  getTasks(searchQuery: string = '', sortBy: string = '', sortDirection: string = 'asc', pageSize: number, pageNumber: number): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('searchQuery', searchQuery)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString());

    return this.http.get<TaskResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  addTask(addTaskRequest: AddTaskRequest): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, addTaskRequest)
      .pipe(catchError(this.handleError));
  }

  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`);
  }
  
  

  editTask(id: number, editTaskRequest: EditTaskRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, editTaskRequest);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  exportToExcel(exportRequest: ExportRequest): Observable<Blob> {
    const url = `${this.apiUrl}/export`;
    return this.http.post(url, exportRequest,{ responseType: 'blob' });
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
