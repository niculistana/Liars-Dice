class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :turn
      t.string :diepool
      t.integer :completed

      t.timestamps null: false
    end
  end
end
