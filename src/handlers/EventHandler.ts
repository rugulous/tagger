import { Handler } from ".";
import GenericEvent from "../classes/GenericEvent";

export class EventHandler<T extends GenericEvent> {
    handlers: Handler<T>[];
    accepts: (x: GenericEvent) => x is T;

    constructor(handlers: Handler<T>[],  acceptFn: (x: GenericEvent) => x is T){
        this.handlers = handlers;
        this.accepts = acceptFn;
    }

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