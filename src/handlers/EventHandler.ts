import { Handler } from ".";
import GenericEvent, { EventTypes } from "../classes/GenericEvent";

type HandlerType = Partial<Record<EventTypes, Handler<any>[]>>;

export class EventHandler {
    handlers: HandlerType;

    constructor(handlers: HandlerType){
        this.handlers = handlers;
    }

    async dispatch(event: GenericEvent) {
        const handlers = [];
        for(const type of Object.keys(this.handlers) as EventTypes[]){
            if(type == event.eventType){
                handlers.push(...this.handlers[type]!.filter(h => h.triggers.includes(event.trigger ?? '')));
            }
        }

        handlers.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));      

        console.log(`eventName: ${event.eventName}`);
        console.log(`trigger: ${event.trigger}`);
        console.log(event.context);
        console.log(`found ${handlers.length} handlers`);

        for (const h of handlers) {
            await h.run(event);
        }
    }
}