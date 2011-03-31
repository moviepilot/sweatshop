require 'sinatra'
require 'json'
require 'fileutils'

require 'reisbrei_data'
require 'ruby-debug' if ENV['DEBUGGG']

module Reisbrei
  class CreateError < Exception; end
  class App < Sinatra::Application
    set :static, true
    set :public, 'www/public'

    get '/' do
      redirect '/index.html'
    end

    # get javascript
    get '/static/app.js' do
      content_type 'text/javascript', :charset => 'utf-8'
      files = []
      Dir.glob('www/public/static/js/*.js') { |file| files << file }
      output = ''
      files.sort.each do |file|
        output << File.read(file)
      end
      output
    end

    # create node
    post %r|/nodes/?| do
      json_response {
        new_node = Data.create_node(JSON.parse(request.body.read))
        redirect "/nodes/#{new_node[:_id]}", 303
      }
    end

    # get node
    get '/nodes/:id' do |id|
      json_response { Data.get_node(id) }
    end

    # update node
    put '/nodes/:id' do |id|
      json_response { Data.update_node(id, JSON.parse(request.body.read)) }
    end

    get %r|/nodes/([^/]+)/edges/?([^/]*)/?([^/]*)| do |id, dir, type|
      options = {}
      options[:dir] = dir unless dir.empty?
      options[:type] = type unless type.empty?

      json_response { Data.edges_of_node(id, options) }
    end

    post %r|/edges/?| do
      json_response {
        new_edge = Data.create_edge(JSON.parse(request.body.read))
        redirect "/edges/#{new_edge[:_id]}", 303
      }
    end

    get '/edges/:id' do |id|
      json_response { Data.get_edge(id) }
    end

    # update edge
    put '/edges/:id' do |id|
      json_response { Data.update_edge(id, JSON.parse(request.body.read)) }
    end

    get '/search' do
      json_response { Data.search(params['term']) }
    end

    def json_response(&block)
      content_type :json
      data = block.call
      return [404, nil.to_json] unless data
      data = data.to_json
      data = wrap_jsonp(data, params[:callback]) if params[:callback]
      data
    rescue JSON::ParserError
      return [400, "Invalid JSON".to_json]
    rescue Reisbrei::CreateError => e
      return [400, e.message.to_json]
    end

    def wrap_jsonp(json, callback)
      "%s(%s);" % [callback, json]
    end
  end
end
