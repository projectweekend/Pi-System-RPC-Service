from StringIO import StringIO

from fabric import api
from fabric.operations import prompt, put


UPSTART_TEMPLATE = """
description "Pi-System-RPC-Service"
start on runlevel [2345]
stop on runlevel [06]
respawn
respawn limit 10 5

env LOGGLY_TOKEN={loggly_token}
env LOGGLY_SUBDOMAIN={loggly_domain}
env RABBIT_URL={rabbit_url}

script
        cd /home/pi/Pi-System-RPC-Service/app && node main.js
end script
"""


def raspberry_pi():
	api.env.hosts = ["{0}.local".format(prompt("Raspberry Pi:"))]
	api.env.user = 'pi'


def install():
	api.require('hosts', provided_by=[raspberry_pi])

	upstart_values = {}
	upstart_values['loggly_token'] = prompt("Loggly token:")
	upstart_values['loggly_domain'] = prompt("Loggly domain:")
	upstart_values['rabbit_url'] = prompt("Rabbit URL:")
	upstart_file = StringIO(UPSTART_TEMPLATE.format(**upstart_values))

	with api.cd('/etc/init'):
		upload = put(upstart_file, 'system-rpc.conf', use_sudo=True)
		assert upload.succeeded

	api.run('git clone https://github.com/projectweekend/Pi-System-RPC-Service.git')

	with api.cd('~/Pi-System-RPC-Service/app'):
		api.run('npm install')

	api.sudo('service system-rpc start')


def update():
	api.require('hosts', provided_by=[raspberry_pi])

	with api.settings(warn_only=True):
		api.sudo('service system-rpc stop')

	with api.cd('~/Pi-System-RPC-Service'):
		api.run('git pull origin master')

	with api.cd('~/Pi-System-RPC-Service/app'):
		api.run('npm install')

	api.sudo('service system-rpc start')
