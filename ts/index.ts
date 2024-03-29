import { EventListner } from "./EventListener";
import { Status, Task, statusMap } from "./Task";
import { TaskCollection } from "./TaskCollection";
import { TaskRenderer } from "./TaskRenderer";

// ビルド時下記コマンドを入れておく
// export NODE_OPTIONS=--openssl-legacy-provider
class Application {
    private readonly eventListner = new EventListner();
    private readonly taskCollection = new TaskCollection();
    private readonly taskRenderer = new TaskRenderer(
        document.getElementById("todoList") as HTMLElement,
        document.getElementById("doingList") as HTMLElement,
        document.getElementById("doneList") as HTMLElement
    );

    start() {
        const taskItems = this.taskRenderer.renderAll(this.taskCollection);
        const createForm = document.getElementById("createForm") as HTMLElement;
        const deleteAllDoneTaskButton = document.getElementById("deleteAllDoneTask") as HTMLElement;

        taskItems.forEach(({ task, deleteButtonEl }) => {
            this.eventListner.add("click", deleteButtonEl, () => this.handleClickDeleteTask(task), task.id);
        });

        this.eventListner.add("submit", createForm, this.handleSubmit);
        this.eventListner.add("click", deleteAllDoneTaskButton, this.handleClickDeleteAllDoneTasks);

        this.taskRenderer.subscribeDragAndDrop(this.handleDropAndDrop);
    }

    private handleClickDeleteAllDoneTasks = () => {
        if (!window.confirm("DONEのタスクを一括削除してよろしいですか？")) return;

        const doneTasks = this.taskCollection.filter(statusMap.done);

        doneTasks.forEach((task) => this.executeDeleteTask(task));
    };

    private handleDropAndDrop = (el: Element, sibling: Element | null, newStatus: Status) => {
        const taskId = this.taskRenderer.getId(el);

        if (!taskId) return;

        const task = this.taskCollection.find(taskId);

        if (!task) return;

        task.update({ status: newStatus });
        this.taskCollection.update(task);

        if (sibling) {
            const nextTaskId = this.taskRenderer.getId(sibling);
            if (!nextTaskId) return;

            const nextTask = this.taskCollection.find(nextTaskId);
            if (!nextTask) return;

            this.taskCollection.moveAboveTarget(task, nextTask);
        } else {
            this.taskCollection.moveToLast(task);
        }
    };

    private handleSubmit = (e: Event) => {
        e.preventDefault();
        const titleInput = document.getElementById("title") as HTMLInputElement;

        if (!titleInput.value) return;

        const task = new Task({ title: titleInput.value });
        this.taskCollection.add(task);
        const { deleteButtonEl } = this.taskRenderer.append(task);

        this.eventListner.add("click", deleteButtonEl, () => this.handleClickDeleteTask(task), task.id);

        titleInput.value = "";
    };

    private executeDeleteTask = (task: Task) => {
        this.eventListner.remove(task.id);
        this.taskCollection.delete(task);
        this.taskRenderer.remove(task);
    };

    private handleClickDeleteTask = (task: Task) => {
        if (!window.confirm(`${task.title}を削除していいですか？`)) return;
        this.executeDeleteTask(task);
    };
}

window.addEventListener("load", () => {
    const app = new Application();
    app.start();
});
