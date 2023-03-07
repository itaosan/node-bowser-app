type Listners = {
    [id: string]: {
        event: string
        element: HTMLElement
        handler : (e:Event) => void
    }
}
export class EventListner{
    private readonly listners : Listners = {}

    add(listnerId: string,event: string,element: HTMLElement,handler: ( e:Event) => void){
        this.listners[listnerId] = {
            event,
            element,
            handler,
        }

        element.addEventListener(event,handler)
    }

    remove(listnerId: string){
        const listner = this.listners[listnerId]
        if (!listner) return

        listner.element.removeEventListener(listner.event,listner.handler)

        delete this.listners[listnerId]
    }
}