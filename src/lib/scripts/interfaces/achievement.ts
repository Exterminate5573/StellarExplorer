export class Achievement {

    public id: string;
    public unlocked: () => boolean;
    private requirement: () => boolean;

    private completed: boolean = false;

    constructor(id: string, requirement: () => boolean, unlocked?: () => boolean) {
        this.id = id;
        this.requirement = requirement;
        this.unlocked = unlocked ?? (() => true);
    }
 
    public isCompleted(): boolean {
        return this.completed;
    }

    public getSave(): JSON {
        return {
            id: this.id,
            completed: this.completed
        } as unknown as JSON;
    }

    public loadSave(obj: any): void {
        if (obj.completed !== undefined) {
            this.completed = obj.completed;
        }
    }

    public checkCompletion(): void {
        if (!this.completed && this.requirement()) {
            this.completed = true;
        }
    }
}