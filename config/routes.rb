Rails.application.routes.draw do

  devise_for :users
  
  resources :game_users
  resources :games
  resources :users, only: [:index, :pages]

  root                      "pages#landing"
  get 'join'             => "pages#join",         as: :join
  get 'about'            => "pages#about",        as: :about
  get "session/name_id"  => "session#name_id"
  get "session/user_id"  => "session#user_id"
  get "session/game_user_ids/"  => "session#game_user_ids"
  get "session/game_turn_id"  => "session#game_turn_id"
  post "games/join/:id" => "games#join"
  get "games/join/:id" => "games#show"
  # get "session/user_username"  => "session#user_username"
  get "session/recent_user"  => "session#recent_user"
  get "session/least_recent_user"  => "session#least_recent_user"
  get "session/recent_user_name/:id"  => "session#recent_user_name"
  post "chat/message"    => "chat#message"
  post "games/:id/bid"       => "games#bid"
  post "games/:id/challenge" => "games#challenge"
  post "games/lose_dice" => "games#lose_dice"
  post "games/deal_dice" => "games#deal_dice"
  post "games/:id/start_game" => "games#start_game"
  post "games/:id/start_round" => "games#start_round"
  post "games/:id/start_turn" => "games#start_turn"
  post "games/:id/end_turn" => "games#end_turn"
  get "game_users/:id/user_username" => "game_users#user_username"
  # /game_users/1/user_username
  post "game_users/show_dice" => "game_users#show_dice"
  post "/"               => "games#create"

  #devise_scope :user do
  #  authenticated :user do
  #    root :to => 'pages#index', as: :authenticated_root
  #  end
  #  unauthenticated :user do
  #    root :to => 'devise/registrations#new', as: :unauthenticated_root
  #  end
  #end

  

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
