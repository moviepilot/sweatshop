require 'json'
require './www/lib/reisbrei_data'
require 'ruby-debug'

def l; load 'transform.rb'; end

def read
  $source = JSON.parse(File.read('sheldon_movies.json'))
end

def transform
  read unless $source
  people_map = Hash.new
  $source.each do |movie|
    @movie = movie
    @people = movie.delete('people') || []
    movie['name'] = 'No Title' unless movie['name']
    movie_id = Reisbrei::Data.create_node(movie)[:_id]
    @people.each do |person|
      if not (person_id = people_map[person['permalink']])
        person_id = Reisbrei::Data.create_node(person)[:_id]
        people_map[person['permalink']] = person_id
      end
      Reisbrei::Data.create_edge({'type'=> 'WorksIn', 'from'=>person_id, 'to'=>movie_id})
      Reisbrei::Data.create_edge({'type'=> 'InWorks', 'from'=>movie_id, 'to'=>person_id})
    end
  end
rescue Exception => e
  debugger;0
end

# 5
def unique_persons(how_many_per_movie)
  $source.map do |movie|
    movie['people'].sort do |a,b|
      a['relevance'] <=> b['relevance']
    end[0...how_many_per_movie]
  end.flatten.uniq.count
end

module ExtractFromMoviepilot
  def p_to_j(person); {:type=>'Person',:name=>person.name,:picture_url=>(person.images.first ? "http://www.moviepilot.de"+person.images.first.public_filename(:poster) : ''),:permalink=>person.permalink,:relevance=>person.calculate_relevance}; end
  def m_to_j(movie); {:type => 'Movie', :name => movie.original_title, :picture_url => "http://www.moviepilot.de"+movie.poster_public_filename(:poster), :permalink => movie.permalink, :moviemaster_id => movie.moviemaster_id, :people=>movie.people.map{|p| p_to_j(p)}}; end
  def write; File.open('sheldon_movies.json', 'w+') {|f| f << Movie.order_by('relevance desc').all(:conditions=>'cinema_start_date > "2011-01-01"').map{|m| m_to_j(m)}.to_json }; end
end
