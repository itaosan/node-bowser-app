import { v4 as uuid } from "uuid";

type Handler<T> = T extends keyof HTMLElementEventMap ? (e: HTMLElementEventMap[T]) => void : (e: Event) => void;

type Listners = {
    [id: string]: {
        event: string;
        element: HTMLElement;
        handler: (e: Event) => void;
    };
};
export class EventListner {
    private readonly listners: Listners = {};

    add<T extends string>(event: T, element: HTMLElement, handler: Handler<T>, listnerId = uuid()) {
        this.listners[listnerId] = {
            event,
            element,
            handler,
        };

        element.addEventListener(event, handler);
    }

    remove(listnerId: string) {
        const listner = this.listners[listnerId];
        if (!listner) return;

        listner.element.removeEventListener(listner.event, listner.handler);

        delete this.listners[listnerId];
    }
}
