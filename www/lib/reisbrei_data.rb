module Reisbrei
  module Data
    extend self
    def get_node(id)
      id = id.to_i
      Nodes[id].merge({:_id => id})
    end

    def simple_node(id)
      get_node(id).reject {|k,v| !%w(type _id name).include? k.to_s}
    end

    def create_node(data)
      check_valid_node!(data)
      node = Nodes[(id = Nodes.keys.max+1)] = {}
      data.each do |k,v|
        node[k.to_sym] = v
      end
      get_node(id)
    end

    def update_node(id, data)
      id = id.to_i
      return nil unless node = Nodes[id]
      data.each do |key, val|
        next if %w(_id type).include? key.to_s
        node[key.to_sym] = val
      end
      get_node(id)
    end

    def edges_of_node(node_id, options={})
      node_id = node_id.to_i
      options = {:dir => '*'}.merge!(options)

      # filter direction
      edges = Edges.select do |id, edge|
        %w(* out).include?(options[:dir]) && edge[:from] == node_id or
        %w(* in).include?(options[:dir]) && edge[:to] == node_id
      end

      # filter type
      edges = edges.select do |id, edge|
        edge[:type] == options[:type]
      end if options[:type]

      edges.map {|id, edge| get_edge(id)}
    end

    def search(query)
      tokens = query.to_s.split(/\s+/).compact.uniq
      node_ids = tokens.map do |token|
        Nodes.select do |k,v|
          v[:name] =~ /#{Regexp.escape token}/i
        end.to_a.map(&:first)
      end.compact.flatten.uniq
      node_ids.map {|id| simple_node(id)}
    end

    def get_edge(id)
      id = id.to_i
      expand_edge(Edges[id].merge({:_id => id}))
    end

    def create_edge(data)
      check_valid_edge!(data)
      edge = Edges[(id = Edges.keys.max+1)] = {}
      data.each do |k,v|
        edge[k.to_sym] = v
      end
      get_edge(id)
    end

    def update_edge(id, data)
      id = id.to_i
      return nil unless edge = Edges[id]
      data.each do |key,val|
        next if %w(_id type from to).include? key.to_s
        edge[key.to_sym] = val
      end
      get_edge(id)
    end

    def expand_edge(edge)
      edge = edge.clone
      edge[:from] = simple_node(edge[:from])
      edge[:to] = simple_node(edge[:to])
      edge
    end

    def check_valid_node!(data)
      raise CreateError, 'missing type' unless data['type']
      raise CreateError, 'missing name' unless data['name']
      true
    end

    def check_valid_edge!(data)
      raise CreateError, 'missing type' unless data['type']
      raise CreateError, "missing from relation" unless data['from']
      raise CreateError, "unknown 'from' node #{data['from']}" unless Nodes.has_key?(data['from'].to_i)
      raise CreateError, "missing to relation" unless data['to']
      raise CreateError, "unknown 'to' node #{data['to']}" unless Nodes.has_key?(data['to'].to_i)
      raise CreateError, "edge already existing" if check_edge_exists?(data)
      true
    end

    def check_edge_exists?(data)
      not Edges.select do |id, edge|
        edge[:type]   == data['type'] &&
          edge[:to]   == data['to']   &&
          edge[:from] == data['from']
      end.empty?
    end

    Nodes = {
      12233 => {
        :type => "Person",
        :name => "Johnny Depp",
        :facebook_ids => [ '98765', '87654' ],
        :moviemaster_id => 16345,
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0486/8280/Johnny_Depp_person.jpg',
        :permalink => "johnny-depp"
      },
      1 => {
        :type => 'Movie',
        :name => 'Fear and Loathing in Las Vegas',
        :facebook_ids => ['51234', '12344', '21340'],
        :moviemaster_id => 547,
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0002/3676/23676_person.jpg',
        :permalink => 'fear-and-loathing-in-las-vegas'
      },
      2 => {
        :type => 'Movie',
        :name => 'Pirates of the Caribbean',
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0001/3043/13043.jpg',
        :permalink => 'fluch-der-karibik'
      },
      3 => {
        :type => 'Movie',
        :name => 'Sleepy Hollow',
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0467/6252/Sleepy_Hollow.jpg',
        :permalink => 'sleepy-hollow'
      },
      4 => {
        :type => 'Movie',
        :name => 'Public Enemies',
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0179/8959/49d877e28ecdc.jpg',
        :permalink => 'public-enemies-2'
      },
      5 => {
        :type => 'Movie',
        :name => 'The Libertine',
        :picture_url => 'http://static2.moviepilot.de/de/files/images/0004/2298/poster.jpg',
        :permalink => 'the-libertine'
      }

    }

    Edges = {
      1 => {
        :weight => 0.8,
        :type => 'WorksIn',
        :from => 12233,
        :to => 1
      },
      2 => {
        :weight => 0.4,
        :type => 'WorksIn',
        :from => 12233,
        :to => 2
      },
      3 => {
        :weight => 0.6,
        :type => 'WorksIn',
        :from => 12233,
        :to => 3
      },
      4 => {
        :weight => 0.2,
        :type => 'WorksIn',
        :from => 12233,
        :to => 4
      },
      5 => {
        :weight => 0.3,
        :type => 'WorksIn',
        :from => 12233,
        :to => 5
      }
    }
  end
end
