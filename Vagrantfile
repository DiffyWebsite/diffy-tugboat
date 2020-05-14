# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/bionic64"

  config.vm.network "private_network", ip: "192.168.100.107"

  #config.vm.synced_folder "./", "/var/www/", :nfs => { :mount_options => ["dmode=777","fmode=666"] }

  # If you have trouble with NFS above, comment it out and use the following instead
  config.vm.synced_folder "./", "/var/www/", :mount_options => ["dmode=777", "fmode=666"]
  config.vm.synced_folder "./", "/var/www/", :owner=> 'www-data', :group=>'root'

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "3072"
    vb.cpus = 1
  end

  config.ssh.insert_key = true

  config.vm.provision :shell, keep_color: true, path: "Vagrant.provision.sh"

end
