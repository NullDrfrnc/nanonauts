class Nanonauts {
    static bush_spawner_1;
    static bush_spawner_2;
    static ground;
    static nanonaut;
    static robot_spawner;
    static flying_robot_spawner;
    static flying_robot_spawner_2;
    static start_move_speed = 200;
    static distance_ui;
    static healthbar
    static paused_text

    static sky;
    static mountains_background;
    static mountains_midground;
    static mountains_foreground;
    static clouds;
    static trees;

    static event_spawner

    static game_over_text;
    static restart_text;
    static game_over = false;

    static start() {
        this.game_over = false

        this.sky = new Background()
        this.sky.sprite.src = "assets/sky.png"
        this.sky.scroll_multiplier = 1

        this.mountains_background = new Background()
        this.mountains_background.sprite.src = "assets/mountains_background.png"
        this.mountains_background.scroll_multiplier = 0.15

        this.mountains_midground = new Background()
        this.mountains_midground.sprite.src = "assets/mountains_midground.png"
        this.mountains_midground.scroll_multiplier = 0.2

        this.mountains_foreground = new Background()
        this.mountains_foreground.sprite.src = "assets/mountains_foreground.png"
        this.mountains_foreground.scroll_multiplier = 0.3

        this.clouds = new Background()
        this.clouds.sprite.src = "assets/clouds.png"
        this.clouds.scroll_multiplier = 1.2

        this.trees = new Background()
        this.trees.sprite.src = "assets/trees.png"
        this.trees.scroll_multiplier = 1

        this.distance_ui = new TextEngineObject()
        this.distance_ui.font = "customfont"
        this.distance_ui.font_size = 96
        this.distance_ui.text = "0m"
        this.distance_ui.x = 10
        this.distance_ui.y = 70
        this.healthbar = new Healthbar()

        this.paused_text = new TextEngineObject()

        this.paused_text.text = ""
        this.paused_text.font = "customfont"
        this.paused_text.font_size = 96

        this.paused_text.x = 150
        this.paused_text.y = 300

        this.game_over_text = new TextEngineObject()
        this.game_over_text.text = ""
        this.game_over_text.font = "customfont"
        this.game_over_text.font_size = 96
        this.game_over_text.x = 185
        this.game_over_text.y = 280

        this.restart_text = new TextEngineObject()
        this.restart_text.text = ""
        this.restart_text.font = "customfont"
        this.restart_text.font_size = 32
        this.restart_text.x = 235
        this.restart_text.y = 340

        this.ground = new Ground();

        this.nanonaut = new Nanonaut();
        Nanonaut.move_speed = Nanonauts.start_move_speed;
        Nanonaut.distance_travelled = 0
        this.nanonaut.x = 80

        this.robot_spawner = new RobotSpawner()
        this.robot_spawner.spawn_interval = 3
        this.robot_spawner.spawn_time_variance = 1

        this.flying_robot_spawner = new FlyingRobotSpawner()
        this.flying_robot_spawner.spawn_interval = 4
        this.flying_robot_spawner.spawn_time_variance = 1
        this.flying_robot_spawner.min_y = 250
        this.flying_robot_spawner.max_y = 270

        this.flying_robot_spawner_2 = new FlyingRobotSpawner()
        this.flying_robot_spawner_2.spawn_interval = 6
        this.flying_robot_spawner_2.spawn_time_variance = 3
        this.flying_robot_spawner_2.min_y = 360
        this.flying_robot_spawner_2.max_y = 380

        this.bush_spawner_1 = new BushSpawner()
        this.bush_spawner_1.y = Settings.CANVAS_HEIGHT - 70
        this.bush_spawner_1.x = Settings.CANVAS_WIDTH + 100

        this.bush_spawner_1.spawn_interval = 1.783

        this.bush_spawner_2 = new BushSpawner();
        this.bush_spawner_2.y = Settings.CANVAS_HEIGHT - 35
        this.bush_spawner_2.x = Settings.CANVAS_WIDTH + 100

        this.bush_spawner_2.spawn_interval = 2.348

        this.event_spawner = new RandomEventSpawner()

        this.event_spawner.spawn_interval = 20
        this.event_spawner.spawn_time_variance = 10

        Engine.get_instance().add_engine_object(this.sky)

        Engine.get_instance().add_engine_object(this.mountains_background, 2)

        Engine.get_instance().add_engine_object(this.mountains_midground, 3)

        Engine.get_instance().add_engine_object(this.mountains_foreground, 4)

        Engine.get_instance().add_engine_object(this.clouds, 5)

        Engine.get_instance().add_engine_object(this.trees, 6)

        Engine.get_instance().add_engine_object(this.ground, 8)

        Engine.get_instance().add_engine_object(this.bush_spawner_1, 11)

        Engine.get_instance().add_engine_object(this.nanonaut, 12)

        Engine.get_instance().add_engine_object(this.event_spawner, 13)

        Engine.get_instance().add_engine_object(this.robot_spawner, 14)
        Engine.get_instance().add_engine_object(this.flying_robot_spawner, 14)
        Engine.get_instance().add_engine_object(this.flying_robot_spawner_2, 14)

        Engine.get_instance().add_engine_object(this.bush_spawner_2, 15)

        Engine.get_instance().add_engine_object(this.distance_ui, 16)
        Engine.get_instance().add_engine_object(this.healthbar, 16)
        Engine.get_instance().add_engine_object(this.paused_text, 16)
        Engine.get_instance().add_engine_object(this.game_over_text, 16)
        Engine.get_instance().add_engine_object(this.restart_text, 16)

        this.event_spawner.spawn()

        // I didn't feel like this was important, don't even see it but claude thinks it's a problem so oh well
        Engine.get_instance().get_context_2d().imageSmoothingEnabled = false
    }

    static game_over_screen() {
        this.game_over = true

        const engine = Engine.get_instance()
        engine.paused = true

        this.game_over_text.text = "GAME OVER"
        this.restart_text.text = "PRESS R TO RESTART"
    }

    static restart() {
        const engine = Engine.get_instance()

        engine.paused = false

        engine.remove_all_objects()

        setTimeout(() => {
            this.start()
        }, 50)
    }
}

class Background extends SpriteEngineObject {
    #scroll_offset = 0
    scroll_multiplier = 1

    init() {
        this.height = Settings.CANVAS_HEIGHT
        this.width = Settings.CANVAS_WIDTH
    }

    physics_process(delta) {
        this.#scroll_offset += Nanonaut.move_speed * this.scroll_multiplier * delta;
        this.#scroll_offset %= this.width * 2;
    }

    draw(ctx) {
        const x = Math.floor(-this.#scroll_offset);

        this.#draw_image(ctx, x, false);
        this.#draw_image(ctx, x + this.width, true);
        this.#draw_image(ctx, x + this.width * 2, false);
    }

    #draw_image(ctx, x, flipped) {
        if (!flipped) {
            ctx.drawImage(
                this.sprite,
                x,
                this.y,
                this.width,
                this.height
            );
            return;
        }

        ctx.save();
        ctx.translate(x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(
            this.sprite,
            0,
            0,
            this.width,
            this.height
        );
        ctx.restore();
    }
}

class Ground extends EngineObject {
    #ground_size = 28

    init() {
        this.collision = true

        this.width = Settings.CANVAS_WIDTH
        this.height = this.#ground_size

        this.y = Settings.CANVAS_HEIGHT - this.#ground_size

        this.hitbox_y = this.#ground_size / 1.5
        this.hitbox_offset_y = this.#ground_size / 1.5
    }
}

class Nanonaut extends SpriteSheetEngineObject {
    max_health = 3
    health = 0
    velocity_y = 0
    is_grounded = false

    #jump_pressed = false
    #jump_held = false
    #jump_time = 0
    #move_right = false
    #move_left = false

    #max_jump_time = 0.25

    invulnerable = false
    invulnerability_time = 0
    #invulnerability_duration = 0.75

    #speed_boost_active = false
    #speed_boost_time = 0
    #move_force_multiplier = 1

    static move_speed = 150
    static distance_travelled = 0

    init() {
        this.debug_color="#190023"

        this.collision = true
        this.sprite.src = "assets/nanonaut.png"
        this.height = 120
        this.width = 100

        this.hitbox_x = 50
        this.hitbox_offset_x = 33
        this.hitbox_y = this.height - 20
        this.hitbox_offset_y = 20


        this.sprite_size_x = 182
        this.sprite_size_y = 229
        this.frames_per_row = 5
        this.frame_amount = 7

        this.animation_speed = Nanonaut.move_speed / 30

        this.y = Nanonauts.ground.get_hitbox_y() - this.height

        this.health = this.max_health
    }

    damage(amount) {
        if (Nanonauts.game_over || this.invulnerable) {
            return
        }

        this.health -= amount

        Nanonauts.healthbar.update()

        // Start i-frames
        this.invulnerable = true
        this.invulnerability_time =
            this.#invulnerability_duration

        if (this.health <= 0) {
            Nanonauts.game_over_screen()
        }
    }

    heal(amount) {
        if (Nanonauts.game_over) {
            return
        }

        if (this.health < this.max_health) {
            this.health = Math.min(this.health + amount, this.max_health)
            Nanonauts.healthbar.update()
        }
    }

    apply_speed_boost(multiplier, duration) {
        if (this.#speed_boost_active) {
            this.#speed_boost_time = duration
            return
        }

        this.#speed_boost_active = true
        this.#speed_boost_time = duration
        this.#move_force_multiplier = multiplier
    }

    on_collisions(others) {
        const ground = others.find(other => other instanceof Ground)

        if (ground) {
            this.is_grounded = true
            this.y = ground.get_hitbox_y() - this.height
        }
    }

    on_key_pressed(key) {
        if (key === "KeyR") {
            Nanonauts.restart()
        }

        if ((key === "Space" || key === "ArrowUp" || key === "KeyW") && this.is_grounded) {
            this.#jump_pressed = true
            this.#jump_held = true
        }

        if (key === "Escape" && !Nanonauts.game_over) {
            Engine.get_instance().paused = !Engine.get_instance().paused

            if (Engine.get_instance().paused) {
                Nanonauts.paused_text.text = "Game Paused"
            } else {
                Nanonauts.paused_text.text = ""
            }
        }

        if (key === "KeyD" || key === "ArrowRight") {
            this.#move_right = true
        }

        if (key === "KeyA" || key === "ArrowLeft") {
            this.#move_left = true
        }
    }

    on_key_released(key) {
        if (key === "Space" || key === "ArrowUp" || key === "KeyW") {
            this.#jump_held = false
        }

        if (key === "KeyD" || key === "ArrowRight") {
            this.#move_right = false
        }

        if (key === "KeyA" || key === "ArrowLeft") {
            this.#move_left = false
        }
    }

    process() {
        super.process()

        if (this.invulnerable) {
            this.visible = Math.floor(
                this.invulnerability_time * 12
            ) % 2 === 0
        } else {
            this.visible = true
        }
    }

    physics_process(delta) {
        super.physics_process(delta)

        if (this.invulnerable) {
            this.invulnerability_time -= delta

            if (this.invulnerability_time <= 0) {
                this.invulnerability_time = 0
                this.invulnerable = false
            }
        }

        if (this.#speed_boost_active) {
            this.#speed_boost_time -= delta

            if (this.#speed_boost_time <= 0) {
                this.#speed_boost_active = false
                this.#move_force_multiplier = 1
            }
        }

        if (this.#jump_pressed && this.is_grounded) {
            this.velocity_y = -Settings.JUMP_FORCE / 3

            this.is_grounded = false
            this.#jump_pressed = false
            this.#jump_time = 0
        }

        if (!this.is_grounded) {

            if (this.#jump_held && this.#jump_time < this.#max_jump_time) {
                this.velocity_y -=
                    Settings.JUMP_FORCE * delta

                this.#jump_time += delta
            }

            this.velocity_y += Settings.GRAVITY * delta

            this.y += this.velocity_y * delta
        }

        Nanonaut.move_speed += Nanonaut.move_speed / 100 * delta

        this.animation_speed = Nanonaut.move_speed / 30

        Nanonaut.distance_travelled += Nanonaut.move_speed * delta

        Nanonauts.distance_ui.text = `${Nanonaut.get_move_distance()}m`

        if (this.#move_right) {
            let new_x = this.x + Settings.MOVE_FORCE * this.#move_force_multiplier * delta

            if (new_x >= Settings.CANVAS_WIDTH - this.width) {
                new_x = Settings.CANVAS_WIDTH - this.width
            }

            this.x = new_x
        }

        if (this.#move_left) {
            let new_x = this.x - Settings.MOVE_FORCE * 2 * this.#move_force_multiplier * delta

            if (new_x <= 0) {
                new_x = 0
            }

            this.x = new_x
        }

        this.is_grounded = false

        console.log(this.y)
    }

    static get_move_distance() {
        return (
            Nanonaut.distance_travelled / 100
        ).toFixed(0)
    }
}

class Robot extends SpriteSheetEngineObject {
    #damage = 1

    init() {
        this.debug=true
        this.debug_color = "#0051ff"


        this.collision = true
        this.sprite.src = "assets/robot.png"
        this.height = 70
        this.width = 70

        this.sprite_size_x = 141
        this.sprite_size_y = 139
        this.frames_per_row = 3
        this.frame_amount = 9

        this.hitbox_y = 50
        this.hitbox_x = 50

        this.hitbox_offset_y = 20
        this.hitbox_offset_x = 10

        this.animation_speed = Nanonaut.move_speed / 30

        this.y = Nanonauts.ground.get_hitbox_y() - this.height
    }

    on_collisions(others) {
        const nanonaut = others.find(
            other => other instanceof Nanonaut
        )

        if (nanonaut) {
            nanonaut.damage(this.#damage)
            this.death()
        }
    }

    death() {
        Engine.get_instance().remove_engine_object(this)

        let boom = new BigBoom()

        boom.x = this.x
        boom.y = this.y

        Engine.get_instance().add_engine_object(boom, this.layer)
    }

    physics_process(delta) {
        super.physics_process(delta)
        this.x -= Nanonaut.move_speed * 1.1 * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
        }
    }
}

class FlyingRobot extends Robot {
    min_y = 0
    max_y = 0

    #time = 0

    init() {
        super.init()

        this.sprite.src = "assets/flying_robot.png"

        this.sprite_size_x = 139
        this.sprite_size_y = 141

        this.width = 70
        this.height = 70

        this.collision = true

        this.hitbox_x = 50
        this.hitbox_y = 40
        this.hitbox_offset_y = 15
        this.hitbox_offset_x = 10

        this.#time = 0

        // Start in het midden van min_y en max_y
        this.y = (this.min_y + this.max_y) / 2
    }

    physics_process(delta) {
        super.physics_process(delta)

        this.#time += delta

        const middle = (this.min_y + this.max_y) / 2
        const amplitude = (this.max_y - this.min_y) / 2

        this.y = middle + Math.sin(this.#time * 3) * amplitude
    }
}

class Healthbar extends EngineObject {
    #hearts = []
    #max_health = 3
    #heart_spacing = 72

    init() {
        this.#max_health = Nanonauts.nanonaut.health

        for (let i = 0; i < this.#max_health; i++) {
            this.#hearts.push(new Heart())
        }

        super.init()
    }

    update() {
        const health = Nanonauts.nanonaut.health

        this.#hearts.forEach((heart, index) => {
            heart.sprite.src =
                index < health
                    ? "assets/hp_full.png"
                    : "assets/hp_empty.png"
        })
    }

    draw(ctx) {
        this.#hearts.forEach((heart, index) => {
            ctx.drawImage(
                heart.sprite,
                Settings.CANVAS_WIDTH - this.#heart_spacing * (index + 1),
                10
            )
        })

        ctx.fillText(
            "hp: ",
            Settings.CANVAS_WIDTH - this.#heart_spacing * (this.#max_health + 2),
            70
        )
    }
}
class Heart extends SpriteEngineObject {
    constructor() {
        super();
        this.sprite.src = "assets/hp_full.png"

        super.init()
    }
}

// Claude's analysis straight up lied about the sprite sheet here, there are no empty cells as it says there are
class BigBoom extends SpriteSheetEngineObject {
    init() {
        this.animation_speed = 20

        this.frames_per_row = 5
        this.frame_amount = 17

        this.sprite_size_x = 200
        this.sprite_size_y = 282

        this.height = 70
        this.width = 70

        this.sprite.src = "assets/boom.png"

        this.current_frame_nr = 9
    }

    process() {
        super.process();

        if (this.current_frame_nr === 8) {
            Engine.get_instance().remove_engine_object(this)
        }
    }

    physics_process(delta) {
        super.physics_process(delta)
        this.x -= Nanonaut.move_speed * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
        }
    }
}

class VariableBushSprite extends VariableSpriteEngineObject {
    init() {
        let bush1 = new Image()
        bush1.src = "assets/bush1.png"

        let bush2 = new Image()
        bush2.src = "assets/bush2.png"

        this.sprite.push(bush1, bush2)

        this.width = 100
        this.height = 50

        super.init()
    }

    physics_process(delta) {
        this.x -= Nanonaut.move_speed * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
        }
    }
}

class FlyingRobotSpawner extends EngineObjectSpawnerEngineObject {
    min_y = 0
    max_y = 0

    init() {
        this.x = Settings.CANVAS_WIDTH + 50

        this.engine_object = FlyingRobot

        super.init()
    }

    spawn() {
        const robot = new this.engine_object()

        robot.min_y = this.min_y
        robot.max_y = this.max_y

        robot.x = this.x

        Engine.get_instance().add_engine_object(robot, this.layer)
    }

}

class RobotSpawner extends EngineObjectSpawnerEngineObject {
    init() {
        this.x = Settings.CANVAS_WIDTH + 50
        this.y = 400

        this.engine_object = Robot

        super.init()
    }

    physics_process(delta) {
        this.spawn_timer -= delta

        if (this.spawn_timer <= 0) {
            this.spawn()

            const speed_multiplier =
                Nanonaut.move_speed / Nanonauts.start_move_speed

            const spawn_multiplier = Math.sqrt(speed_multiplier)

            const interval =
                this.spawn_interval / spawn_multiplier

            const variance =
                this.spawn_time_variance / spawn_multiplier

            this.spawn_timer =
                Math.max(0.75, interval) +
                (Math.random() * 2 - 1) * variance
        }
    }
}

class BushSpawner extends EngineObjectSpawnerEngineObject {
    init() {
        this.engine_object = VariableBushSprite

        super.init()
    }

    physics_process(delta) {
        this.spawn_timer -= delta

        if (this.spawn_timer <= 0) {
            this.spawn()

            const speed_multiplier =
                Nanonaut.move_speed / Nanonauts.start_move_speed

            const spawn_multiplier = Math.sqrt(speed_multiplier)

            const interval =
                this.spawn_interval / spawn_multiplier

            const variance =
                this.spawn_time_variance / spawn_multiplier

            this.spawn_timer =
                Math.max(0.75, interval) +
                (Math.random() * 2 - 1) * variance
        }
    }
}

class Platform extends SpriteEngineObject {
    #speed = 50

    init() {
        this.collision = true

        this.sprite.src = "assets/platform.png"
        this.width = 200
        this.height = 70

        this.hitbox_y = this.height / 2
        this.hitbox_offset_y = this.height / 2

        super.init();
    }

    physics_process(delta) {
        this.x -= this.#speed * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
        }
    }
}

class Laser extends SpriteEngineObject {
    #blocked = false

    tip_sprite = new Image()
    #tip_height = 16

    #speed = 150

    #original_y = 0

    init() {
        this.debug = true
        this.debug_color = "#671212"

        this.tip_sprite.src = "assets/laser.png"
        this.sprite.src = "assets/laser_beam.png"

        this.width = 36
        this.height = Nanonauts.ground.get_hitbox_y()

        this.collision = true

        this.#original_y = this.y

        super.init()
    }

    physics_process(delta) {
        this.y = this.#original_y
        this.#blocked = false

        this.x -= this.#speed * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
        }
    }

    draw(ctx) {
        let draw_y = this.y - this.#tip_height

        // Beam
        ctx.drawImage(
            this.sprite,
            this.x,
            draw_y,
            this.width,
            this.height
        )

        // Tip
        ctx.drawImage(
            this.tip_sprite,
            this.x,
            Math.floor(draw_y + this.height),
            this.width,
            this.#tip_height
        )
    }

    on_collisions(others) {
        const platform = others.find(
            other => other instanceof Platform
        )

        if (platform) {
            this.#blocked = true

            this.y =
                this.#original_y -
                (Settings.CANVAS_HEIGHT - platform.get_hitbox_y())

            return
        }

        const nanonaut = others.find(
            other => other instanceof Nanonaut
        )

        if (nanonaut) {
            nanonaut.damage(1)
        }
    }

    not_colliding() {
        this.#blocked = false
    }
}

class LaserEvent extends EngineObject {
    #start_delay = 0.5
    #timer = 0

    #double_laser_chance = 0.2

    init() {
        this.#timer = this.#start_delay
    }

    physics_process(delta) {
        this.#timer -= delta

        if (this.#timer > 0) {
            return
        }

        this.#spawn_event()

        Engine.get_instance().remove_engine_object(this)
    }

    #spawn_event() {
        // Platform
        const platform = new Platform()

        platform.x = Settings.CANVAS_WIDTH
        platform.y = 150

        Engine.get_instance().add_engine_object(
            platform,
            13
        )

        // Eerste laser
        const first_x = this.#random_laser_x()

        this.#spawn_laser(first_x)

        // Kans op tweede laser
        if (Math.random() < this.#double_laser_chance) {
            let second_x

            do {
                second_x = this.#random_laser_x()
            } while (Math.abs(second_x - first_x) < 200)

            this.#spawn_laser(second_x)
        }
    }

    #spawn_laser(x_offset) {
        const laser = new Laser()

        laser.x = Settings.CANVAS_WIDTH + x_offset

        Engine.get_instance().add_engine_object(
            laser,
            14 // Spawn on layer 14 cuz of a visual bug
        )
    }

    #random_laser_x() {
        const min = 800
        const max = 1600

        return Math.random() * (max - min) + min
    }
}

class RandomEventSpawner extends EngineObjectSpawnerEngineObject {
    init() {
        super.init()
    }

    spawn() {
        const events = [
            LaserEvent,
            ItemEvent
        ]

        const EventClass =
            events[Math.floor(Math.random() * events.length)]

        const event = new EventClass()

        Engine.get_instance().add_engine_object(event, this.layer)
    }
}

class ItemEvent extends EngineObject {
    #start_delay = 0.5
    #timer = 0

    init() {
        this.#timer = this.#start_delay
    }

    physics_process(delta) {
        this.#timer -= delta

        if (this.#timer > 0) {
            return
        }

        this.#spawn_item()

        Engine.get_instance().remove_engine_object(this)
    }

    #spawn_item() {
        const items = [
            ShieldItem,
            HealItem,
            SpeedItem
        ]

        const ItemClass =
            items[Math.floor(Math.random() * items.length)]

        const item = new ItemClass()

        // Bovengrens: bovenste flying robot laag
        const min_y = Nanonauts.flying_robot_spawner.min_y

        // Ondergrens: grond-robot hoogte (zelfde formule als Robot.init())
        const max_y =
            Nanonauts.ground.get_hitbox_y() - item.height

        item.x = Settings.CANVAS_WIDTH + 50
        item.y = min_y + Math.random() * (max_y - min_y)

        Engine.get_instance().add_engine_object(item, 15)
    }
}

class Item extends SpriteEngineObject {
    item_behavior
    init() {
        super.init()

        this.collision = true

        this.height = 48
        this.width = 48
    }

    on_collisions(others) {
        const nanonaut = others.find(
            other => other instanceof Nanonaut
        )

        if(nanonaut) {
            this.item_behavior.on_use(nanonaut)
        }

        Engine.get_instance().remove_engine_object(this)
    }

    physics_process(delta) {
        super.physics_process(delta)

        this.x -= Nanonaut.move_speed * delta

        if (this.x + this.width < -100) {
            Engine.get_instance().remove_engine_object(this)
            return
        }

        this.item_behavior.physics_process(delta)
    }
}

class ItemBehavior extends EngineObject {
    on_use(nanonaut) {

    }
}

class ShieldItemBehavior extends ItemBehavior {
    #duration = 7

    on_use(nanonaut) {
        nanonaut.invulnerability_time = this.#duration
        nanonaut.invulnerable = true
    }
}
class ShieldItem extends Item {
    init() {
        super.init()

        this.item_behavior = new ShieldItemBehavior()

        this.sprite.src = "assets/shield.png"
    }
}

class HealItem extends Item {
    init() {
        super.init()

        this.item_behavior = new HealItemBehavior()

        this.sprite.src = "assets/hp_full.png"
    }
}

class HealItemBehavior extends ItemBehavior {
    on_use(nanonaut) {
        nanonaut.heal(1)
    }
}

class SpeedItemBehavior extends ItemBehavior {
    #duration = 20
    #multiplier = 2

    on_use(nanonaut) {
        nanonaut.apply_speed_boost(this.#multiplier, this.#duration)
    }
}

class SpeedItem extends Item {
    init() {
        super.init()

        this.item_behavior = new SpeedItemBehavior()

        this.sprite.src = "assets/drugs.png"
    }
}