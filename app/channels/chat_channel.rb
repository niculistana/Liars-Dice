  class ChatChannel < ApplicationCable::Channel
    def subscribed
      stream_from "chat_channel_1"
    end

    def unsubscribed
    end
  end
