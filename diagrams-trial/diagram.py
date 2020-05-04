from diagrams import Diagram, Cluster

from diagrams.aws.database import Dynamodb
from diagrams.azure.database import CosmosDb
from diagrams.onprem.ci import Jenkins
from diagrams.onprem.client import Client, Users
from diagrams.onprem.compute import Server
from diagrams.onprem.database import MongoDB
from diagrams.onprem.network import Nginx
from diagrams.onprem.vcs import Git

with Diagram("trial", show=False, outformat="png"):
    with Cluster("office"):
        git = Git("GitBucket")
        developer = Client("developer")

    with Cluster("on-premises"):
        on_premises_balancer = Server("balancer")
        on_premises_deploy_worker = Jenkins("deploy worker")

        with Cluster("ASP"):
            on_premises_asp_app = Server("application")
            on_premises_asp_db = MongoDB("database")
            on_premises_asp_web_server = Nginx("web server")

    with Cluster("AWS"):
        aws_balancer = Server("balancer")
        aws_jenkins = Jenkins("deploy worker")

        with Cluster("ASP"):
            aws_asp_app = Server("application")
            aws_asp_db = Dynamodb("database")
            aws_asp_web_server = Nginx("web server")

    with Cluster("Azure"):
        azure_balancer = Server("balancer")
        azure_jenkins = Jenkins("deploy worker")

        with Cluster("ASP"):
            azure_asp_app = Server("application")
            azure_asp_db = CosmosDb("database")
            azure_asp_web_server = Nginx("web server")

    consumers = Users("consumers")

    # on-premises
    git >> on_premises_deploy_worker
    developer >> on_premises_deploy_worker
    on_premises_asp_app >> on_premises_asp_db
    on_premises_asp_web_server << on_premises_balancer
    on_premises_asp_web_server >> on_premises_asp_app
    on_premises_balancer << consumers
    on_premises_deploy_worker >> on_premises_asp_app

    # AWS
    git >> aws_jenkins
    developer >> aws_jenkins
    aws_asp_app >> aws_asp_db
    aws_asp_web_server << aws_balancer
    aws_asp_web_server >> aws_asp_app
    aws_balancer << consumers
    aws_jenkins >> aws_asp_app

    # Azure
    git >> azure_jenkins
    developer >> azure_jenkins
    azure_asp_app >> azure_asp_db
    azure_asp_web_server << azure_balancer
    azure_asp_web_server >> azure_asp_app
    azure_balancer << consumers
    azure_jenkins >> azure_asp_app

    # other
    git >> developer
