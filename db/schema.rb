# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_04_06_062948) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "pgjwt"
  enable_extension "pgsodium"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  create_table "game_users", id: :serial, force: :cascade do |t|
    t.integer "game_id"
    t.integer "user_id"
    t.string "dice"
    t.integer "dice_quantity", default: 5
    t.boolean "is_ready", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_users_on_game_id"
    t.index ["user_id"], name: "index_game_users_on_user_id"
  end

  create_table "games", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "owner"
    t.integer "prev_player_id"
    t.integer "turn"
    t.integer "max_users"
    t.integer "quantity", default: 0
    t.integer "value", default: 0
    t.integer "logged_in_users", default: 0
    t.string "diepool"
    t.integer "winner_id"
    t.integer "round", default: 0
    t.integer "state", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "username", default: "", null: false
    t.integer "wins", default: 0, null: false
    t.integer "losses", default: 0, null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["wins"], name: "index_users_on_wins"
    t.check_constraint "(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)", name: "users_email_change_confirm_status_check"
  end

  add_foreign_key "game_users", "games"
  add_foreign_key "game_users", "users"
end
