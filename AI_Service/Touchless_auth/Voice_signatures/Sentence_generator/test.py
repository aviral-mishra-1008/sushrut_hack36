from markov import MarkovChain

def test_text_generation():    
    try:
        model = MarkovChain.load_model('./AI_Service/Sentence_generator/markov_model.json')
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return
    
    test_seeds = [
        ('space', 7),
        ('time', 7),
    ]
    
    for seed, length in test_seeds:
        generated_text = model.generate_text(seed, length)
        print(generated_text)

test_text_generation()