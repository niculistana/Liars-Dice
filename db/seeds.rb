# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

u1 = User.create(email: "nicu@test.com", username:"Listana", wins: 0, losses: 0, password:"ayyylmao", password_confirmation:"ayyylmao")
u2 = User.create(email: "david@test.com", username:"MastahChau", wins: 24, losses: 55,password:"ayyylmao", password_confirmation:"ayyylmao")
u3 = User.create(email: "eric@test.com", username:"Cheneric", wins: 84, losses: 100,password:"ayyylmao", password_confirmation:"ayyylmao")
u4 = User.create(email: "josh@test.com", username:"Majiccow",  wins: 42, losses: 64, password:"ayyylmao", password_confirmation:"ayyylmao")
u5 =  User.create(email: "lamey@test.com", username:"Bootstrap Bill" , wins: 148 ,losses: 17 ,password:"lameduck", password_confirmation:"lameduck")
u6 =  User.create(email: "lam@test.com", username:"Jack Sparrow" , wins: 34 ,losses: 50 ,password:"lameduck", password_confirmation:"lameduck")
u7 =  User.create(email: "lamer@test.com", username:"Keith Richards" , wins: 28 ,losses: 40 ,password:"lameduck", password_confirmation:"lameduck")
u8 =  User.create(email: "lamest@test.com", username:"BlackBeard" , wins: 40 ,losses: 50 ,password:"lameduck", password_confirmation:"lameduck")
u9 =  User.create(email: "lamerest@test.com", username:"Davy Jones" , wins: 17 ,losses: 18 ,password:"lameduck", password_confirmation:"lameduck")
u10 = User.create(email: "superlame@test.com", username:"Locker" , wins: 16 ,losses: 16 ,password:"lameduck", password_confirmation:"lameduck") 

# g1 = Game.create(name: "Nicu's Game", turn: "nicu", round:0, max_users: 4, quantity: 9, state: 0, value: 8, logged_in_users: 4, diepool: "1,2,3,4,5,6", :winner_id,: 0)

# GameUser.create(game_id: g1.id, user_id: u1.id, dice: "1,2,3,4,5")
# GameUser.create(game_id: g1.id, user_id: u2.id, dice: "5,4,3,2,1")
# GameUser.create(game_id: g1.id, user_id: u3.id, dice: "3,2,1,2,5")
# GameUser.create(game_id: g1.id, user_id: u4.id, dice: "4,3,5,1,2")
