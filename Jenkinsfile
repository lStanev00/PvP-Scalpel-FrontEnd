pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        COMPOSE_DIR = "/home/lych/production-apps/pvp-scalpel"
        FRONTEND_SERVICE_NAME = "frontend"
        FRONTEND_IMAGE_NAME = "pvp-s-frontend"
        FRONTEND_DOCKERFILE_PATH = "./Dockerfile"
        FRONTEND_BUILD_CONTEXT = "."
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Show branch") {
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
            }
        }

        stage("Resolve service") {
            steps {
                script {
                    // Jenkins may expose the branch as production, origin/production,
                    // refs/heads/production, or refs/remotes/origin/production.
                    def rawBranchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ""
                    def branchName = rawBranchName
                        .replaceFirst(/^refs\/remotes\/origin\//, "")
                        .replaceFirst(/^refs\/heads\//, "")
                        .replaceFirst(/^origin\//, "")

                    // Non-production branches should still complete without deploying.
                    if (branchName != "production") {
                        echo "No production service mapped for branch '${branchName}'. Build and deploy stages will be skipped."
                        return
                    }

                    echo "Resolved branch '${branchName}' -> service='${env.FRONTEND_SERVICE_NAME}', image='${env.FRONTEND_IMAGE_NAME}', dockerfile='${env.FRONTEND_DOCKERFILE_PATH}', context='${env.FRONTEND_BUILD_CONTEXT}'."
                }
            }
        }

        stage("Build service") {
            when {
                branch "production"
            }
            steps {
                // Build only the service selected from the current production branch.
                sh "docker build -f ${env.FRONTEND_DOCKERFILE_PATH} -t ${env.FRONTEND_IMAGE_NAME}:latest ${env.FRONTEND_BUILD_CONTEXT}"
            }
        }

        stage("Deploy service") {
            when {
                branch "production"
            }
            steps {
                sh """
                    cd ${COMPOSE_DIR}
                    docker compose up -d --no-deps --force-recreate ${env.FRONTEND_SERVICE_NAME}
                """
            }
        }
    }

    post {
        always {
            sh "docker image prune -f"
        }
    }
}
