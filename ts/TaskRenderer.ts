import { Task } from "./Task";

export class TaskRenderer {
    constructor(private readonly todolist: HTMLElement){}
    
    append(task : Task){
        const {taskEl,deleteButtonEl} = this.render(task)
        this.todolist.append(taskEl)
        return {deleteButtonEl}
    }
    remove(task:Task){
        const taskEl = document.getElementById(task.id)
        if (!taskEl) return

        this.todolist.removeChild(taskEl)
    }

    private render(task:Task){
        const taskEl = document.createElement('div')
        const spanEl = document.createElement('span')
        const deleteButtonEl = document.createElement('button')

        taskEl.id = task.id
        taskEl.classList.add('task-item')

        spanEl.textContent = task.title
        deleteButtonEl.textContent = '削除'

        taskEl.append(spanEl,deleteButtonEl)

        return {taskEl,deleteButtonEl}
    }
}