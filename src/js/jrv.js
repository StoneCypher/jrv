
class JRV {

    constructor(comp = (() => true), onchange = (() => true)) {
        this.dirty          = true;
        this.comp           = comp;
        this.change_handler = onchange;
        this.callbacks      = [];
        this.update();
    }

    flag_dirty() {
        this.dirty = true;
        if (this.change_handler) { this.update(); }
        this.callbacks.map(cb => cb());
        return this;
    }

    should_notify(cb) {
        this.callbacks = this.callbacks.concat(cb);
    }

    needs(Dep) {
        if (Array.isArray(Dep)) { Dep.map(d => d.should_notify(this.make_notifier())); }
        else                    { Dep.should_notify(this.make_notifier()); }
        return this;
    }

    make_notifier() {
        return (() => this.flag_dirty());
    }

    onchange(newOnChange) {
        this.change_handler = newOnChange;
        return this;
    }

    set v(newComp) {
        this.comp = newComp;
        this.update();
        this.callbacks.map(cb => cb());
    }

    get v() {
        if (this.dirty) { this.update(); }
        return this.value;
    }

    update() {

        var compIsFunc = (typeof this.comp  === 'function'),
            valIsObj   = (typeof this.value === 'object'),
            oldVal     = valIsObj? undefined : this.value;

        this.dirty = false;

        this.value = (compIsFunc? this.comp() : this.comp);

        if (this.value !== oldVal) {
            this.change_handler(this.value, oldVal);
        }

        return this.value;

    }

}
