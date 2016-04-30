# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

u1 = User.create(email: "nicu@test.com", password:"ayyylmao", password_confirmation:"ayyylmao")
u2 = User.create(email: "david@test.com", password:"ayyylmao", password_confirmation:"ayyylmao")
u3 = User.create(email: "eric@test.com", password:"ayyylmao", password_confirmation:"ayyylmao")
u4 = User.create(email: "josh@test.com", password:"ayyylmao", password_confirmation:"ayyylmao")

g1 = Game.create(name: "Nicu's Game", turn: "nicu", max_users: 4, logged_in_users: 4, diepool: "1,2,3,4,5,6", completed: 0)

# GameUser.create(game_id: g1.id, user_id: u1.id, dice: "1,2,3,4,5")
GameUser.create(game_id: g1.id, user_id: u2.id, dice: "5,4,3,2,1")
GameUser.create(game_id: g1.id, user_id: u3.id, dice: "3,2,1,2,5")
# GameUser.create(game_id: g1.id, user_id: u4.id, dice: "4,3,5,1,2")
