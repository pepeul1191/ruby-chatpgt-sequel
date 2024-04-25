# Rakefile
task default: [:clean, :build, :install]

task :clean do
  puts "Cleaning packages"
  # `rm *.deb`
end

task :secret do
  require 'securerandom'; puts SecureRandom.hex
end

task :run do
  puts 'hola start dev'
  #run MyApp
end

namespace :dev do
  task :start do
    sh 'rerun rackup --dir config,app/controllers,app/helpers,app/models'
  end
end