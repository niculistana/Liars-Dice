class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :owner
      t.integer :prev_player_id
      t.string :turn
      t.integer :round
      t.integer :max_users
      t.integer :quantity, :default => 0
      t.integer :value, :default => 0
      t.integer :logged_in_users, :default => 0
      t.string :diepool
      t.integer :completed, :default => 0
      t.integer :round, :default => 0
      t.integer :state, :default => 0
      
      t.timestamps null: false
    end
  end
end
