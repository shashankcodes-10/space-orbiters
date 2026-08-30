@Library('shared') _

pipeline {
    agent any

    tools {
        jdk 'jdk17'
    }

    environment {
        SONAR_HOME              = tool 'sonar-scanner'
        DOCKERHUB_CREDENTIALS   = 'docker-hub-credentials'
        PLATFORM                = 'linux/amd64'
        BACKEND_IMAGE           = 'space-orbiters-backend'
        MAIN_APP_IMAGE          = 'space-orbiters-main-app'
        SOLAR_SYSTEM_IMAGE      = 'space-orbiters-solar-system'
        CHATROOM_IMAGE          = 'space-orbiters-chatroom'
    }

    stages {

        stage('Clone Repository') {
            steps {
                clone('https://github.com/shashankcodes-10/space-orbiters.git', 'master')
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sonarqube_analysis('sonar-server', 'space-orbiters', 'space-orbiters')
            }
        }

        stage('Quality Gate') {
            steps {
                sonar_quality_gate()
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                owasp_check('DP-Check')
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                trivy_fs_scan()
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        [name: env.BACKEND_IMAGE,      path: 'backend'],
                        [name: env.MAIN_APP_IMAGE,     path: 'frontend/main-app'],
                        [name: env.SOLAR_SYSTEM_IMAGE, path: 'frontend/solar-system'],
                        [name: env.CHATROOM_IMAGE,     path: 'frontend/chatroom'],
                    ]
                    services.each { svc ->
                        dir(svc.path) {
                            docker_build(svc.name, 'Dockerfile.multistage', env.PLATFORM)
                        }
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                script {
                    def images = [
                        env.BACKEND_IMAGE,
                        env.MAIN_APP_IMAGE,
                        env.SOLAR_SYSTEM_IMAGE,
                        env.CHATROOM_IMAGE,
                    ]
                    images.each { img ->
                        trivy_image_scan(img, "trivy-image-report-${img}.html")
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    def images = [
                        env.BACKEND_IMAGE,
                        env.MAIN_APP_IMAGE,
                        env.SOLAR_SYSTEM_IMAGE,
                        env.CHATROOM_IMAGE,
                    ]
                    images.each { img ->
                        docker_hub_push(env.DOCKERHUB_CREDENTIALS, img)
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                docker_run()
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-fs-report-html, trivy-image-report-*.html, dependency-check-report.xml', allowEmptyArchive: true
        }
        success {
            post_success()
        }
        failure {
            post_failure()
        }
    }
}