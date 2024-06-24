import { Handler } from ".";
import GenericEvent from "../classes/GenericEvent";

export abstract class EventHandler<T extends GenericEvent> {
    handlers: Handler<T>[];

    constructor(handlers: Handler<T>[] = []){
        this.handlers = handlers;
    }

    abstract accepts(x: any): x is T;

    async dispatch(event: T) {
        const handlers = this.handlers
            .filter(h => h.triggers.includes(event.trigger ?? ''))
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

        console.log(`eventName: ${event.eventName}`);
        console.log(`trigger: ${event.trigger}`);
        console.log(event.context);
        console.log(`found ${handlers.length} handlers`);

        for (const h of handlers) {
            await h.run(event);
        }
    }
}

export class PrEventHandler<T extends GenericEvent> extends EventHandler<T>{
    accepts(x: any): x is T{
        return true;
    }
}