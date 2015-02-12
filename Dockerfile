FROM centos:centos7

ADD . /opt/app

# Set the final working dir to the Rails app's location.
WORKDIR /opt/app

CMD python -m SimpleHTTPServer $PORT
