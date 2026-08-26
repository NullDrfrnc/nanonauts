/*
 * Ownership of Jeroen Suurmond (github.com/NullDrfrnc)
 */

class Settings {
    static CANVAS_HEIGHT = 600
    static CANVAS_WIDTH = 800

    static PHYSICS_STEP = 60

    static GRAVITY = 1200
    static JUMP_FORCE = 1500
    static MOVE_FORCE = 150
}

class Engine {
    static #instance = null;

    #engine_objects = [];
    #to_remove = []
    #canvas = null;

    #last_time = 0;
    #physics_accumulator = 0;

    paused = false;

    constructor() {
        this.#canvas = document.createElement("canvas")
        this.#canvas.width = Settings.CANVAS_WIDTH;
        this.#canvas.height = Settings.CANVAS_HEIGHT;

        document.getElementById("game_area").appendChild(this.#canvas);

        window.requestAnimationFrame((t) => this.#engine_process_loop(t))
        window.addEventListener('keydown', (e) => {
            this.#engine_objects.forEach(eo => {
                eo.on_key_pressed(e.code)
            })
        })
        window.addEventListener('keyup', e => {
            this.#engine_objects.forEach(eo => {
                eo.on_key_released(e.code)
            })
        })
    }

    // Returns the instance of the engine
    static get_instance() {
        if (!this.#instance)
            this.#instance = new Engine();

        return this.#instance;
    }

    // Returns the canvas context
    get_context_2d() {
        return this.#canvas.getContext("2d", {alpha: false});
    }

    add_engine_object(engine_object, layer = 0) {
        if (!engine_object)
            throw "No object passed to add to the engine's context"

        if (!(engine_object instanceof EngineObject))
            throw "Object does not extend from EngineObject"

        if (layer < 0 || layer > 16) {
            throw "Render layer must be between 0 and 16"
        }

        this.#engine_objects.push(engine_object);
        engine_object.layer = layer;
        engine_object.init()
    }

    remove_engine_object(engine_object) {
        if (!this.#to_remove.includes(engine_object)) {
            this.#to_remove.push(engine_object)
        }
    }

    remove_all_objects() {
        this.#engine_objects.forEach(eo => this.remove_engine_object(eo))
    }

    #check_collisions() {
        const collidables = this.#engine_objects.filter(eo => eo.collision)

        for (let i = 0; i < collidables.length; i++) {
            for (let j = i + 1; j < collidables.length; j++) {
                const a = collidables[i]
                const b = collidables[j]

                if (a.aabb_intersects(b)) {
                    a.on_collision(b);
                    b.on_collision(a);
                }

            }
        }
    }

    // The main loop which calls process and physics_process on each object passed into context
    #engine_process_loop(current_time) {
        const delta = current_time - this.#last_time;
        this.#last_time = current_time;

        if (!this.paused) {
            this.#physics_accumulator += delta;

            while (this.#physics_accumulator >= this.get_physics_step()) {
                this.#engine_objects.forEach(eo => {
                    eo.physics_process(this.get_physics_step() / 1000)
                })

                this.#check_collisions()

                this.#physics_accumulator -= this.get_physics_step()
            }

            this.#to_remove.forEach(engine_object => {
                const index = this.#engine_objects.indexOf(engine_object)

                if (index !== -1) {
                    this.#engine_objects.splice(index, 1)
                }
            })
        }


        this.get_context_2d().clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#engine_objects
            .sort((a, b) => a.layer - b.layer)
            .forEach(engine_object => {
                engine_object.process()
                engine_object.draw(this.get_context_2d())
            })

        window.requestAnimationFrame((t) => this.#engine_process_loop(t))
    }

    get_engine_objects_with_type(type) {
        return this.#engine_objects.filter(eo => eo instanceof type)
    }

    get_physics_step() {
        return 1000 / Settings.PHYSICS_STEP;
    }
}

class EngineObject {
    width = 0
    height = 0
    x = 0
    y = 0
    previous_x = 0
    previous_y = 0
    layer = 0

    collision = false;
    hitbox_x = null
    hitbox_y = null
    hitbox_offset_x = 0
    hitbox_offset_y = 0

    // Called when object enters canvas
    init() {
    }

    // Called each frame
    process() {
    }

    draw(ctx) {
    }

    // Called each physics frame/tick
    physics_process(delta) {
    }

    on_key_pressed(key) {
    }

    on_key_released(key) {}

    on_collision(other) {
    }

    // AABB collision check, including potention hitbox and offset
    aabb_intersects(other) {
        const a_x = this.get_hitbox_x();
        const a_y = this.get_hitbox_y();
        const a_w = this.get_hitbox_width();
        const a_h = this.get_hitbox_height();

        const b_x = other.get_hitbox_x();
        const b_y = other.get_hitbox_y();
        const b_w = other.get_hitbox_width();
        const b_h = other.get_hitbox_height();

        return a_x <= b_x + b_w &&
            a_x + a_w >= b_x &&
            a_y <= b_y + b_h &&
            a_y + a_h >= b_y;
    }

    get_hitbox_width() {
        return this.hitbox_x ?? this.width;
    }

    get_hitbox_height() {
        return this.hitbox_y ?? this.height;
    }

    get_hitbox_x() {
        return this.x + this.hitbox_offset_x;
    }

    get_hitbox_y() {
        return this.y + this.hitbox_offset_y;
    }

    get_context_2d() {
        return Engine.get_instance().get_context_2d()
    }
}

class TextEngineObject extends EngineObject {
    text = ""
    text_color = "#000000"
    font = "Comic Sans MS"
    font_size = 16

    draw(ctx) {
        ctx.fillStyle = this.text_color
        ctx.font = `${this.font_size}px ${this.font}`
        ctx.fillText(this.text, this.x, this.y)
    }
}

class ColorRectEngineObject extends EngineObject {
    color = "#FFFFFF"

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class SpriteEngineObject extends EngineObject {
    sprite = new Image();

    draw(ctx) {
        if (this.width !== 0 && this.height !== 0)
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        else
            ctx.drawImage(this.sprite, this.x, this.y)
    }
}

class VariableSpriteEngineObject extends SpriteEngineObject {
    sprite = []
    variant = 0

    init() {
        this.variant = Math.floor(Math.random()*this.sprite.length)
    }

    draw(ctx) {
        if (this.width !== 0 && this.height !== 0)
            ctx.drawImage(this.sprite[this.variant], this.x, this.y, this.width, this.height);
        else
            ctx.drawImage(this.sprite[this.variant], this.x, this.y)
    }
}

class SpriteSheetEngineObject extends SpriteEngineObject {
    current_frame_nr = 0

    frames_per_row = 0
    frame_amount = 0
    sprite_size_x = 0
    sprite_size_y = 0

    animation_speed = 0
    #animation_timer = 0

    draw(ctx) {
        let sprite_sheet_row = Math.floor(this.current_frame_nr / this.frames_per_row)
        let sprite_sheet_col = this.current_frame_nr % this.frames_per_row
        let sprite_x = sprite_sheet_col * this.sprite_size_x
        let sprite_y = sprite_sheet_row * this.sprite_size_y

        ctx.drawImage(this.sprite, sprite_x, sprite_y, this.sprite_size_x, this.sprite_size_y, this.x, this.y, this.width, this.height);
    }

    physics_process(delta) {
        this.#animation_timer += delta

        const frame_duration = 1 / this.animation_speed

        if (this.#animation_timer >= frame_duration) {
            this.#animation_timer -= frame_duration

            this.current_frame_nr++

            if (this.current_frame_nr >= this.frame_amount) {
                this.current_frame_nr = 0
            }
        }
    }
}

class EngineObjectSpawnerEngineObject extends EngineObject {
    #disabled = false

    engine_object = null

    spawn_interval = 1
    spawn_time_variance = 0

    spawn_timer = 0

    init() {
        this.spawn_timer = this.#get_spawn_time()
    }

    physics_process(delta) {
        this.spawn_timer -= delta

        if (this.spawn_timer <= 0 && !this.#disabled) {
            this.spawn()

            this.spawn_timer = this.#get_spawn_time()
        }
    }

    #get_spawn_time() {
        return Math.max(
            0.1,
            this.spawn_interval +
            (Math.random() * 2 - 1) * this.spawn_time_variance
        )
    }

    spawn() {
        if (!this.engine_object)
            throw "No engine object configured for spawner"

        const object = new this.engine_object()

        object.x = this.x
        object.y = this.y

        Engine.get_instance().add_engine_object(object, this.layer)
    }

    disable() {
        this.#disabled = true
    }

    enable() {
        this.#disabled = false
    }
}