#!/usr/bin/env python3
"""
Creative Ads Platform - Main Orchestration Entry Point

This is the main entry point for the agentic creative ads scraping
and reverse-prompting platform. It initializes the Agent Brain and
coordinates all pipeline components.
"""

import asyncio
import logging
import signal
import sys
from typing import Optional

from agent.agent_brain import AgentBrain
from agent.config import Config
from agent.job_queue import JobQueue
from firestore.firestore_client import FirestoreClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('platform.log')
    ]
)
logger = logging.getLogger(__name__)


class CreativeAdsPlatform:
    """Main platform orchestrator for the creative ads pipeline."""
    
    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config.from_environment()
        self.agent: Optional[AgentBrain] = None
        self.job_queue: Optional[JobQueue] = None
        self.firestore: Optional[FirestoreClient] = None
        self._shutdown_event = asyncio.Event()
        
    async def initialize(self) -> None:
        """Initialize all platform components."""
        logger.info("Initializing Creative Ads Platform...")
        
        # Initialize Firestore client
        self.firestore = FirestoreClient(
            project_id=self.config.gcp_project_id,
            collection_prefix=self.config.firestore_collection_prefix
        )
        await self.firestore.connect()
        
        # Initialize job queue (Pub/Sub or local)
        self.job_queue = JobQueue(
            project_id=self.config.gcp_project_id,
            topic_name=self.config.pubsub_topic,
            subscription_name=self.config.pubsub_subscription
        )
        await self.job_queue.initialize()
        
        # Initialize Agent Brain
        self.agent = AgentBrain(
            config=self.config,
            job_queue=self.job_queue,
            firestore=self.firestore
        )
        
        logger.info("Platform initialized successfully")
        
    async def run(self) -> None:
        """Run the main platform loop."""
        logger.info("Starting Creative Ads Platform...")
        
        try:
            await self.initialize()
            
            # Start the agent brain processing loop
            await self.agent.start()
            
            # Wait for shutdown signal
            await self._shutdown_event.wait()
            
        except Exception as e:
            logger.error(f"Platform error: {e}", exc_info=True)
            raise
        finally:
            await self.shutdown()
            
    async def shutdown(self) -> None:
        """Gracefully shutdown all platform components."""
        logger.info("Shutting down Creative Ads Platform...")
        
        if self.agent:
            await self.agent.stop()
            
        if self.job_queue:
            await self.job_queue.close()
            
        if self.firestore:
            await self.firestore.close()
            
        logger.info("Platform shutdown complete")
        
    def request_shutdown(self) -> None:
        """Request a graceful shutdown."""
        self._shutdown_event.set()


def setup_signal_handlers(platform: CreativeAdsPlatform) -> None:
    """Setup signal handlers for graceful shutdown."""
    def handle_signal(sig, frame):
        logger.info(f"Received signal {sig}, initiating shutdown...")
        platform.request_shutdown()
        
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)


async def main():
    """Main entry point."""
    logger.info("=" * 60)
    logger.info("Creative Ads Reverse-Prompting Platform")
    logger.info("=" * 60)
    
    platform = CreativeAdsPlatform()
    setup_signal_handlers(platform)
    
    try:
        await platform.run()
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

