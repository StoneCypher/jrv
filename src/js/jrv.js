
class JRV {

    constructor(comp = (() => true), onchange) {
        this.dirty          = true;
        this.comp           = comp;
        this.change_handler = onchange;
        this.callbacks      = [];
        this.update();
    }

    dirty_descendants() {
        this.callbacks.map(cb => cb());
    }

    flag_dirty() {
        this.dirty = true;
        if (this.change_handler) { this.update(); }
        this.dirty_descendants();
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
    }

    get v() {
        if (this.dirty) { this.update(); }
        return this.value;
    }

    update() {

        var compIsFunc = (typeof this.comp  === 'function'),
            valIsObj   = (typeof this.value === 'object'),
            oldVal     = valIsObj? NaN : this.value;  // because NaN === NaN is false, so nothing .comp() returns will match NaN // because Javascript is gross

        this.dirty = false;

        this.value = (compIsFunc? this.comp() : this.comp);

        if (this.value !== oldVal) {
            this.change_handler? this.change_handler(this.value, oldVal) : true;
        }

        this.dirty_descendants();

        return this.value;

    }

}
