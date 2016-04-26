class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :turn
      t.integer :max_users
      t.integer :logged_in_users
      t.string :diepool
      t.integer :completed

      t.timestamps null: false
    end
  end
end
