class AuthenticationController < ApplicationController

  def login 
    @user = User.find_by username: params[:username]
    
    if(!@user or !@user.authenticate(params[:password]))
      render json: { error: "Invalid Username and/or Password" }, status: :unauthorized
    else 
      payload = {
        iat: Time.now.to_i,
        user_id: @user.id 
      }
      secret = Rails.application.secret_key_base
      token = JWT.encode(payload, secret)

      render json: { token: token }, status: :ok
    end
  end
end
