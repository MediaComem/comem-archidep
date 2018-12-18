# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The '2' in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure('2') do |config|

  config.vm.box = 'ubuntu/bionic64'
  config.vm.network 'private_network', ip: '192.168.50.4'

  config.vm.provider 'virtualbox' do |vb|
    vb.cpus = 2
    vb.memory = 1024
  end

  config.vm.provision 'shell', inline: <<-SHELL
    apt-get update
    apt-get install -y git mysql-server php-fpm php-mysql
  SHELL
end
