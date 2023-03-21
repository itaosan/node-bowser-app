import { EventListner } from "./EventListener"
import { Status,Task } from "./Task"
import { TaskCollection } from "./TaskCollection"
import { TaskRenderer } from "./TaskRenderer"


// export NODE_OPTIONS=--openssl-legacy-provider
class Application {
    private readonly eventListner = new EventListner()
    private readonly taskCollection = new TaskCollection()
    private readonly takRenderer = new TaskRenderer(
        document.getElementById('todoList') as HTMLElement,
        document.getElementById('doingList') as HTMLElement,
        document.getElementById('doneList') as HTMLElement
    )

    start(){
        const createForm = document.getElementById('createForm') as HTMLElement

        this.eventListner.add('submit-handler','submit',createForm,this.handleSubmit)
        this.takRenderer.subscribeDragAndDrop(this.handleDropAndDrop)
    }

    private handleDropAndDrop = (el : Element, sibling : Element | null,newStatus : Status) => {
        const taskId = this.takRenderer.getId(el)

        if (!taskId) return

        const task = this.taskCollection.find(taskId)

        if(!task) return

        task.update({status: newStatus})
        this.taskCollection.update(task)

        console.log(sibling)
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault()
        const titleInput = document.getElementById('title') as HTMLInputElement

        if(!titleInput.value) return

        const task = new Task({title : titleInput.value})
        this.taskCollection.add(task)
        const {deleteButtonEl} = this.takRenderer.append(task)

        this.eventListner.add(
            task.id,
            'click',
            deleteButtonEl,
            () => this.handleClickDeleteTask(task),
        )

        titleInput.value = ''
        
    }

    private handleClickDeleteTask = (task : Task) => {
        if (!window.confirm(`${task.title}を削除していいですか？`)) return
        this.eventListner.remove(task.id)
        this.taskCollection.delete(task)
        this.takRenderer.remove(task)
    }
}

window.addEventListener('load',() => {
    const app = new Application()
    app.start()
})